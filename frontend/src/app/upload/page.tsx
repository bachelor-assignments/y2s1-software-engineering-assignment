"use client";

import { useState } from "react";
import { uploadFile } from "@utils/uploadAPI"; // ✅ use your interceptor
import { useRouter } from "next/navigation";

export default function UploadAsset() {
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // 🧩 Handle file drop
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setFiles(Array.from(e.dataTransfer.files));
  };

  // 🧩 Handle upload button click
  const handleUpload = async () => {
    if (files.length === 0) {
      setError("Please select at least one file to upload.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      files.forEach((file) => formData.append("file", file));

      // ✅ use upload interceptor instead of direct fetch
      const response = await uploadFile(formData);

      alert("✅ Upload complete!");
      console.log("Server response:", response);

      // Optional: navigate to asset list
      router.push("/assets");
    } catch (err: any) {
      console.error("Upload failed:", err);
      setError(err.message || "Upload failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main>
      <h1>Upload Asset</h1>

      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        style={{
          border: "2px dashed gray",
          padding: "20px",
          borderRadius: "10px",
          marginBottom: "10px",
          backgroundColor: "#fafafa",
        }}
      >
        Drag & Drop files here
      </div>

      <button onClick={handleUpload} disabled={loading}>
        {loading ? "Uploading..." : "Upload"}
      </button>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <ul>
        {files.map((f, i) => (
          <li key={i}>{f.name}</li>
        ))}
      </ul>
    </main>
  );
}
