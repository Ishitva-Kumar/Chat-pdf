"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function Dashboard() {
  const [files, setFiles] = useState<any[]>([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/files")
      .then((res) => res.json())
      .then(setFiles)
      .catch(() => setError("Failed to load files"));
  }, []);

  const handleUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setUploading(true);
    setError("");
    const form = e.currentTarget;
    const fileInput = form.elements.namedItem("file") as HTMLInputElement;
    if (!fileInput.files?.[0]) return;
    const formData = new FormData();
    formData.append("file", fileInput.files[0]);
    const res = await fetch("/api/upload", { method: "POST", body: formData });
    if (!res.ok) {
      setError("Upload failed");
    } else {
      const newFile = await res.json();
      setFiles((f) => [newFile, ...f]);
    }
    setUploading(false);
  };

  return (
    <div style={{ background: "var(--background)", color: "var(--foreground)", minHeight: "100svh" }} className="px-6 py-8">
      <form onSubmit={handleUpload} className="mb-4" style={{ background: "var(--card)", color: "var(--card-foreground)", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", padding: 16 }}>
        <input type="file" name="file" accept="application/pdf" required style={{ color: "var(--foreground)", background: "var(--input)", border: "1px solid var(--border)", borderRadius: 4, marginRight: 8 }} />
        <button type="submit" disabled={uploading} style={{ background: "var(--primary)", color: "var(--primary-foreground)", border: "none", borderRadius: 4, padding: "6px 16px", cursor: uploading ? "not-allowed" : "pointer" }}>
          {uploading ? "Uploading..." : "Upload PDF"}
        </button>
      </form>
      {error && <div style={{ color: "var(--destructive)" }}>{error}</div>}
      <div className="flex flex-col space-y-2">
        {files.length === 0 && <div>No files uploaded yet.</div>}
        {files.map((file: any) => (
          <div key={file.fileUrl} style={{ background: "var(--card)", color: "var(--card-foreground)", border: "1px solid var(--border)", borderRadius: 8, padding: 12, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <a href={file.fileUrl} target="_blank" rel="noopener noreferrer" style={{ color: "var(--primary)", textDecoration: "underline" }}>
              {file.fileName}
            </a>
            <Link href={`/dashboard/chat?fileUrl=${encodeURIComponent(file.fileUrl)}&fileName=${encodeURIComponent(file.fileName)}`}>
              <button style={{ marginLeft: 16, background: "var(--primary)", color: "var(--primary-foreground)", border: "none", borderRadius: 4, padding: "6px 16px", cursor: "pointer" }}>Chat</button>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
