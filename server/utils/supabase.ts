import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;
const bucketName = process.env.SUPABASE_STORAGE_BUCKET || "odabnote-files";

export const supabase = (supabaseUrl && supabaseKey) 
  ? createClient(supabaseUrl, supabaseKey)
  : null;

/**
 * Uploads a file buffer to a Supabase Storage bucket.
 * The bucket "wrong-answers" must be created and set to public in Supabase Dashboard.
 */
export async function uploadToSupabase(buffer: Buffer, filename: string, mimeType: string): Promise<string | null> {
  if (!supabase) {
    console.warn("Supabase client not initialized. Cannot upload to Supabase.");
    return null;
  }

  try {
    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(`uploads/${filename}`, buffer, {
        contentType: mimeType,
        upsert: true,
      });

    if (error) {
      console.error("Supabase upload error:", error);
      return null;
    }

    const { data: publicUrlData } = supabase.storage
      .from(bucketName)
      .getPublicUrl(`uploads/${filename}`);

    return publicUrlData.publicUrl;
  } catch (error) {
    console.error("Error in uploadToSupabase:", error);
    return null;
  }
}
