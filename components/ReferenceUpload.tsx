'use client';

import { useState } from 'react';
import { CldUploadWidget } from 'next-cloudinary';

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
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#5a7a00" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
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
              <span style={{ fontFamily: 'var(--font-general)', fontSize: 14, color: '#333' }}>{file.name}</span>
              <button
                onClick={() => removeFile(i)}
                style={{ background: 'none', border: 'none', color: '#999', cursor: 'pointer', fontSize: 18, lineHeight: 1 }}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}