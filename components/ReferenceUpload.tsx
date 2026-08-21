'use client';

import { useState } from 'react';
import { CldUploadWidget } from 'next-cloudinary';
import { UploadCloud, X, FileText } from 'lucide-react';

interface ReferenceUploadProps {
  onUpload: (url: string) => void;
}

export default function ReferenceUpload({ onUpload }: ReferenceUploadProps) {
  const [files, setFiles] = useState<{ name: string; url: string }[]>([]);

  const handleUploadSuccess = (result: any) => {
    const uploadedFile = {
      name: result.event?.name || 'uploaded-file',
      url: result.info?.secure_url || result.info?.url || '',
    };

    if (uploadedFile.url) {
      setFiles(prev => [...prev, uploadedFile]);
      onUpload(uploadedFile.url);
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
    if (files.length === 1) {
      onUpload('');
    }
  };

  return (
    <div>
      <CldUploadWidget
        uploadPreset="slk_designs_upload"
        onSuccess={handleUploadSuccess}
        onError={(error) => console.error('Upload error:', error)}
      >
        {({ open }) => (
          <button
            type="button"
            onClick={() => open()}
            style={{
              width: '100%',
              border: '2px dashed rgba(0,0,0,0.12)',
              borderRadius: 16,
              padding: '40px 24px',
              textAlign: 'center',
              cursor: 'pointer',
              transition: 'border-color 0.2s',
              backgroundColor: 'rgba(255,255,255,0.4)',
            }}
          >
            <div style={{ width: 48, height: 48, borderRadius: 12, backgroundColor: 'rgba(198,255,51,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <UploadCloud size={24} color="#5a7a00" strokeWidth={2} />
            </div>
            <p style={{ fontFamily: 'var(--font-jakarta)', fontWeight: 600, fontSize: 16, color: '#333', marginBottom: 6 }}>Drop files here or click to browse</p>
            <p style={{ fontFamily: 'var(--font-general)', fontSize: 13, color: '#999' }}>JPG, PNG, PDF, AI, PSD, CDR — Max 20MB</p>
          </button>
        )}
      </CldUploadWidget>

      {files.length > 0 && (
        <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
          {files.map((file, i) => (
            <div
              key={i}
              style={{
                backgroundColor: 'rgba(255,255,255,0.55)',
                backdropFilter: 'blur(16px)',
                border: '1px solid rgba(255,255,255,0.45)',
                borderRadius: 16,
                padding: '12px 16px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <FileText size={16} color="#666" />
                <span style={{ fontFamily: 'var(--font-general)', fontSize: 14, color: '#333' }}>{file.name}</span>
              </div>
              <button
                onClick={() => removeFile(i)}
                style={{ background: 'none', border: 'none', color: '#999', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <X size={16} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}