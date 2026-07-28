"use client";

import { useState, useCallback } from "react";
import { Upload, X, Loader2, CheckCircle } from "lucide-react";

interface PhotoUploadProps {
  photos: string[];
  onChange: (photos: string[]) => void;
}

export function PhotoUpload({ photos, onChange }: PhotoUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUpload = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (!files?.length) return;

      setUploading(true);
      setError(null);
      const newPhotos: string[] = [...photos];

      for (const file of Array.from(files)) {
        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        const result = await res.json();

        if (!res.ok || result.error) {
          console.error("Upload error:", result.error);
          setError(result.error || "Upload failed");
          setUploading(false);
          return;
        }

        if (result.url) {
          newPhotos.push(result.url);
        }
      }

      onChange(newPhotos);
      setUploading(false);
      e.target.value = "";
    },
    [photos, onChange],
  );

  function removePhoto(index: number) {
    onChange(photos.filter((_, i) => i !== index));
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-3">
        {photos.map((url, i) => (
          <div key={i} className="relative w-24 h-24 rounded-xl overflow-hidden border shadow-sm group">
            <img src={url} alt={`Photo ${i + 1}`} className="w-full h-full object-cover" />
            <button
              type="button"
              onClick={() => removePhoto(i)}
              className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 hover:bg-red-500 transition-all"
            >
              <X className="h-3.5 w-3.5" />
            </button>
            <div className="absolute bottom-0 inset-x-0 h-6 bg-gradient-to-t from-black/40 to-transparent flex items-end justify-center pb-1">
              <CheckCircle className="h-3 w-3 text-green-400" />
            </div>
          </div>
        ))}
        <label
          className={`w-24 h-24 flex flex-col items-center justify-center gap-1.5 border-2 border-dashed rounded-xl cursor-pointer transition-all ${
            uploading
              ? "border-blue-300 bg-blue-50 pointer-events-none"
              : "border-slate-200 hover:border-blue-400 hover:bg-blue-50/50"
          }`}
        >
          {uploading ? (
            <>
              <Loader2 className="h-6 w-6 text-blue-500 animate-spin" />
              <span className="text-[10px] text-blue-500 font-medium">Uploading</span>
            </>
          ) : (
            <>
              <Upload className="h-5 w-5 text-slate-400" />
              <span className="text-[10px] text-muted-foreground font-medium">Upload</span>
            </>
          )}
          <input
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handleUpload}
            disabled={uploading}
          />
        </label>
      </div>
      {error && (
        <p className="text-xs text-red-500 bg-red-50 rounded-lg px-3 py-2">
          {error}
        </p>
      )}
    </div>
  );
}
