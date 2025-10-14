"use client";
import { useState } from "react";

export default function UploadAsset() {
  const [files, setFiles] = useState<File[]>([]);

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setFiles(Array.from(e.dataTransfer.files));
  };

  const handleUpload = async () => {
    const token = localStorage.getItem("token");
    const formData = new FormData();
    files.forEach(file => formData.append("file", file));

    await fetch("http://localhost:8000/api/assets/upload/", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });

    alert("Upload complete!");
  };

  return (
    <main>
      <h1>Upload Asset</h1>
      <div
        onDrop={handleDrop}
        onDragOver={e => e.preventDefault()}
        style={{ border: "2px dashed gray", padding: "20px" }}
      >
        Drag & Drop files here
      </div>
      <button onClick={handleUpload}>Upload</button>
      <ul>
        {files.map((f, i) => (
          <li key={i}>{f.name}</li>
        ))}
      </ul>
    </main>
  );
}
