"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { uploadAsset } from "@utils/assetAPI"; 

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [metadata, setMetadata] = useState(""); // free-text JSON or comma tags
  const router = useRouter();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!file || !title) return alert("Title and file required");

    const fd = new FormData();
    fd.append("file", file);
    fd.append("title", title);

    // If metadata is JSON, try to parse, else send as simple string in metadata field
    let metaObj: any = {};
    try {
      if (metadata.trim()) metaObj = JSON.parse(metadata);
    } catch {
      // fallback: treat as tags comma separated
      metaObj = { tags: metadata.split(",").map((s) => s.trim()).filter(Boolean) };
    }
    fd.append("metadata", JSON.stringify(metaObj));

    try {
      await uploadAsset(fd);
      alert("Uploaded");
      router.push("/asset");
    } catch (err) {
      console.error("Upload failed:", err);
      alert("Upload failed");
    }
  }

  return (
    <main style={{ padding: 20 }}>
      <h1>Upload Asset</h1>
      <form onSubmit={onSubmit}>
        <div>
          <label>Title</label><br />
          <input value={title} onChange={(e) => setTitle(e.target.value)} required />
        </div>

        <div style={{ marginTop: 8 }}>
          <label>File</label><br />
          <input type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} required />
        </div>

        <div style={{ marginTop: 8 }}>
          <label>Metadata (JSON) or comma tags</label><br />
          <textarea value={metadata} onChange={(e) => setMetadata(e.target.value)} rows={4} />
        </div>

        <div style={{ marginTop: 10 }}>
          <button type="submit">Upload</button>
        </div>
      </form>
    </main>
  );
}
