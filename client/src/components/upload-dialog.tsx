import { useState, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Upload, Camera, Loader2, Image as ImageIcon } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

export function UploadDialog({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("image", file);

      const res = await fetch("/api/wrong-answers/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error("업로드 실패");
      }
      return res.json();
    },
    onSuccess: () => {
      toast({ title: "오답이 등록되었습니다!", description: "AI가 수식과 텍스트 분석 완료" });
      queryClient.invalidateQueries({ queryKey: ["/api/wrong-answers"] });
      queryClient.invalidateQueries({ queryKey: ["/api/wrong-answers/due"] });
      setOpen(false);
      resetState();
    },
    onError: () => {
      toast({ title: "업로드에 실패했습니다.", variant: "destructive" });
    }
  });

  const resetState = () => {
    setPreviewUrl(null);
    setSelectedFile(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleUpload = () => {
    if (selectedFile) {
      uploadMutation.mutate(selectedFile);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(val) => {
      setOpen(val);
      if (!val) resetState();
    }}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>새 오답 등록</DialogTitle>
        </DialogHeader>
        
        <div className="flex flex-col items-center justify-center space-y-4 py-4">
          {!previewUrl ? (
            <div 
              className="border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl w-full h-48 flex flex-col items-center justify-center gap-3 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors"
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center">
                  <Camera className="w-6 h-6" />
                </div>
                <div className="w-12 h-12 bg-slate-100 text-slate-600 rounded-full flex items-center justify-center">
                  <ImageIcon className="w-6 h-6" />
                </div>
              </div>
              <p className="text-sm text-slate-500 font-medium">터치하여 사진 촬영 또는 파일 선택</p>
            </div>
          ) : (
            <div className="relative w-full aspect-video bg-slate-100 dark:bg-slate-900 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800">
              <img src={previewUrl} alt="Preview" className="w-full h-full object-contain" />
              {uploadMutation.isPending && (
                <div className="absolute inset-0 bg-white/70 dark:bg-slate-950/70 backdrop-blur-sm flex flex-col items-center justify-center">
                  <Loader2 className="w-8 h-8 text-blue-600 animate-spin mb-2" />
                  <span className="text-sm font-bold text-slate-700 dark:text-slate-200">AI가 문제를 분석 중입니다...</span>
                </div>
              )}
            </div>
          )}

          <input 
            type="file" 
            accept="image/*" 
            className="hidden" 
            ref={fileInputRef} 
            onChange={handleFileChange}
          />
        </div>

        <div className="flex gap-3 justify-end mt-4">
          <Button variant="ghost" onClick={() => setOpen(false)} disabled={uploadMutation.isPending}>
            취소
          </Button>
          <Button 
            className="flex gap-2" 
            onClick={handleUpload} 
            disabled={!selectedFile || uploadMutation.isPending}
          >
            {uploadMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
            분석 및 등록하기
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
