'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UploadCloud, FileText, CheckCircle2, AlertCircle, X, Loader2 } from 'lucide-react';

interface ReferenceUploadProps {
  onUpload: (url: string) => void;
  currentUrls?: string[];
}

export default function ReferenceUpload({ onUpload, currentUrls = [] }: ReferenceUploadProps) {
  const [files, setFiles] = useState<{ name: string; url: string; size?: number }[]>(
    currentUrls.map((url, idx) => ({ name: `Reference ${idx + 1}`, url }))
  );
  const [isUploading, setIsUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;
    const file = fileList[0];

    // Client-side validation: 20MB limit
    if (file.size > 20 * 1024 * 1024) {
      setErrorMessage('File size exceeds the 20MB limit.');
      return;
    }

    setIsUploading(true);
    setErrorMessage(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/cloudinary-sign', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (!res.ok || !data.secure_url) {
        throw new Error(data.error || 'Upload failed. Please try again.');
      }

      const newFile = {
        name: file.name,
        url: data.secure_url,
        size: file.size,
      };

      setFiles((prev) => [...prev, newFile]);
      onUpload(data.secure_url);
    } catch (err: any) {
      console.error('Upload failed:', err);
      setErrorMessage(err.message || 'File upload failed.');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const removeFile = (index: number) => {
    setFiles((prev) => {
      const updated = prev.filter((_, i) => i !== index);
      onUpload(updated.length > 0 ? updated[updated.length - 1].url : '');
      return updated;
    });
  };

  return (
    <div className="w-full">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,application/pdf,.psd,.ai"
        className="hidden"
        onChange={(e) => handleFileSelect(e.target.files)}
      />

      <motion.div
        whileHover={{ scale: 1.005 }}
        whileTap={{ scale: 0.995 }}
        onClick={() => !isUploading && fileInputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          handleFileSelect(e.dataTransfer.files);
        }}
        className={`relative w-full rounded-2xl border-2 border-dashed p-8 text-center cursor-pointer transition-colors duration-200 backdrop-blur-xl ${
          isDragging
            ? 'border-black bg-black/[0.04]'
            : 'border-neutral-200 dark:border-white/15 bg-neutral-50/50 dark:bg-neutral-900/40 hover:border-neutral-400 dark:hover:border-white/30'
        }`}
      >
        <div className="flex flex-col items-center justify-center space-y-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-100 shadow-sm">
            {isUploading ? (
              <Loader2 className="h-5 w-5 animate-spin text-neutral-600 dark:text-neutral-300" />
            ) : (
              <UploadCloud className="h-5 w-5 stroke-[1.75]" />
            )}
          </div>
          <div>
            <p className="text-sm font-medium tracking-tight text-neutral-900 dark:text-neutral-100">
              {isUploading ? 'Encrypting & uploading asset...' : 'Drop your design asset or browse'}
            </p>
            <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
              Vector, PSD, PDF, PNG or JPG • Max 20MB
            </p>
          </div>
        </div>
      </motion.div>

      {errorMessage && (
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-3 flex items-center gap-2 rounded-xl bg-red-50 dark:bg-red-950/30 p-3 text-xs text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900/40"
        >
          <AlertCircle className="h-4 w-4 shrink-0 stroke-[1.75]" />
          <span>{errorMessage}</span>
        </motion.div>
      )}

      {files.length > 0 && (
        <div className="mt-4 space-y-2">
          <AnimatePresence mode="popLayout">
            {files.map((file, idx) => (
              <motion.div
                key={file.url + idx}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                className="flex items-center justify-between rounded-xl border border-neutral-200 dark:border-white/10 bg-white/70 dark:bg-neutral-900/70 backdrop-blur-md px-4 py-3 shadow-xs"
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-200">
                    <FileText className="h-4 w-4 stroke-[1.75]" />
                  </div>
                  <div className="truncate">
                    <p className="truncate text-xs font-medium text-neutral-900 dark:text-neutral-100">
                      {file.name}
                    </p>
                    {file.size && (
                      <p className="text-[10px] text-neutral-500">
                        {(file.size / 1024 / 1024).toFixed(1)} MB
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="flex items-center gap-1 text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
                    <CheckCircle2 className="h-3.5 w-3.5 stroke-[2]" />
                    Ready
                  </span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFile(idx);
                    }}
                    className="ml-1 rounded-lg p-1.5 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700 dark:hover:bg-neutral-800 dark:hover:text-neutral-200 transition-colors"
                  >
                    <X className="h-4 w-4 stroke-[1.75]" />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}