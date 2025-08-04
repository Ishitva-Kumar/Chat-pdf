"use client"
import { useEffect, useState } from 'react';

// Optionally, define a type for files
// type UserFile = { fileName: string; fileUrl: string; };

export default function Dashboard() {
  const [files, setFiles] = useState<any[]>([]); // <-- Fix: useState<any[]>
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/files')
      .then(res => res.json())
      .then(setFiles)
      .catch(() => setError('Failed to load files'));
  }, []);

  const handleUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setUploading(true);
    setError('');
    const form = e.currentTarget;
    const fileInput = form.elements.namedItem('file') as HTMLInputElement;
    if (!fileInput.files?.[0]) return;
    const formData = new FormData();
    formData.append('file', fileInput.files[0]);
    const res = await fetch('/api/upload', { method: 'POST', body: formData });
    if (!res.ok) {
      setError('Upload failed');
    } else {
      const newFile = await res.json();
      setFiles(f => [newFile, ...f]);
    }
    setUploading(false);
  };

  return (
    <div className='px-6 py-8 h-[100svh]'>
      <form onSubmit={handleUpload} className='mb-4'>
        <input type='file' name='file' accept='application/pdf' required />
        <button type='submit' disabled={uploading}>{uploading ? 'Uploading...' : 'Upload PDF'}</button>
      </form>
      {error && <div className='text-red-500'>{error}</div>}
      <div className='flex flex-col space-y-2'>
        {files.length === 0 && <div>No files uploaded yet.</div>}
        {files.map((file: any) => (
          <div key={file.fileUrl} className='border p-2 rounded'>
            <a href={file.fileUrl} target='_blank' rel='noopener noreferrer'>{file.fileName}</a>
            {/* Future: Add button to chat with Gemini */}
          </div>
        ))}
      </div>
    </div>
  );
}
