"use client";

import { useState } from "react";
import { uploadAsset } from "../../lib/api";
import "./UploadAsset.css";

export default function UploadAsset({ onClose }: { onClose: () => void }) {
  const [title, setTitle] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !title.trim()) {
      setMessage("Please provide a title and select a file.");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      setMessage("You must be logged in to upload assets.");
      return;
    }

    setIsUploading(true);
    setMessage("");

    try {
      await uploadAsset(file, title.trim(), token);
      setMessage("✅ Upload successful!");
      setTimeout(() => {
        onClose();
        window.location.reload();
      }, 1500);
    } catch (err) {
      console.error("Upload error:", err);
      setMessage("❌ Upload failed. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="upload-modal-overlay" onClick={onClose}>
      <div className="upload-modal" onClick={(e) => e.stopPropagation()}>
        <h2>Upload New Asset</h2>
        <form onSubmit={handleSubmit} className="upload-form">
          <div className="form-group">
            <label>Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              disabled={isUploading}
            />
          </div>

          <div className="form-group">
            <label>File</label>
            <input
              type="file"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              required
              disabled={isUploading}
            />
          </div>

          {message && (
            <p
              className={`message ${
                message.startsWith("✅") ? "success" : "error"
              }`}
            >
              {message}
            </p>
          )}

          <div className="form-actions">
            <button type="button" onClick={onClose} disabled={isUploading}>
              Cancel
            </button>
            <button type="submit" disabled={isUploading}>
              {isUploading ? "Uploading..." : "Upload"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
