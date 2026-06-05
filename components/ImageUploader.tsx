'use client';

import { useState } from 'react';

type ReferenceUploadProps = {
  onUpload?: (url: string) => void;
  initialUrl?: string;
};

export default function ReferenceUpload({ onUpload, initialUrl = '' }: ReferenceUploadProps) {
  const [referenceFileUrl, setReferenceFileUrl] = useState(initialUrl);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  async function handleReferenceUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError('');

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error || 'Upload failed');
      }

      const url = data.secure_url || data.url;
      if (!url) {
        throw new Error('No URL returned from Cloudinary');
      }

      setReferenceFileUrl(url);
      onUpload?.(url);
    } catch (uploadError: any) {
      setError(uploadError?.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  }

  return (
    <div style={{ marginTop: 24 }}>
      <label style={{ display: 'block', fontSize: 14, fontWeight: 600, marginBottom: 10, color: '#fff' }}>
        Upload reference file
      </label>
      <input
        type="file"
        accept="image/*"
        onChange={handleReferenceUpload}
        style={{
          display: 'block',
          width: '100%',
          padding: '12px 14px',
          borderRadius: 16,
          border: '1px solid rgba(255,255,255,0.16)',
          background: '#0F0F11',
          color: '#ffffff',
        }}
      />
      {uploading && <p style={{ marginTop: 12, color: '#C6FF33' }}>Uploading reference file…</p>}
      {error && <p style={{ marginTop: 12, color: '#FF6B6B' }}>{error}</p>}
      {referenceFileUrl && (
        <div style={{ marginTop: 18 }}>
          <p style={{ marginBottom: 10, fontSize: 14, color: '#ffffff' }}>Reference preview</p>
          <img
            src={referenceFileUrl}
            alt="Reference preview"
            style={{ width: '100%', maxWidth: 520, borderRadius: 18, boxShadow: '0 24px 80px rgba(0,0,0,0.35)' }}
          />
        </div>
      )}
    </div>
  );
}