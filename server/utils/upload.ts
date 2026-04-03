import multer from "multer";
import crypto from "crypto";

// Use memory storage to process uploads directly to Supabase without touching local disk
const storage = multer.memoryStorage();

export const uploadUrlFilename = (file: Express.Multer.File) => {
    const ext = file.originalname.split('.').pop();
    const hash = crypto.randomBytes(16).toString("hex");
    return `${hash}.${ext}`;
};

export const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit for images
  },
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      cb(new Error("Only image files are allowed"));
      return;
    }
    cb(null, true);
  },
});
