"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function UserDashboard() {
  const router = useRouter();
  const [isDragging, setIsDragging] = useState(false);
  const [files, setFiles] = useState<File[]>([]);

  // --- Logout ---
  const handleLogout = () => {
    localStorage.removeItem("token"); // clear login token
    router.push("/login"); // redirect back to login page
  };

  // --- Drag & Drop File Upload ---
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault(); // prevent browser from opening the file
    setIsDragging(true); // update border color
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const uploadedFiles = Array.from(e.dataTransfer.files);
    setFiles(uploadedFiles); // save files into state
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h1>User Dashboard</h1>

      <button onClick={handleLogout} style={{ marginBottom: "1rem" }}>
        Logout
      </button>

      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        style={{
          border: isDragging ? "3px dashed blue" : "2px dashed gray",
          borderRadius: "10px",
          padding: "40px",
          textAlign: "center",
          backgroundColor: isDragging ? "#eef" : "#fafafa",
          transition: "0.2s",
        }}
      >
        <p>Drag & Drop your files here</p>
        <p>or click to browse</p>
      </div>

      {files.length > 0 && (
        <div style={{ marginTop: "1rem" }}>
          <h3>Uploaded Files:</h3>
          <ul>
            {files.map((file, index) => (
              <li key={index}>{file.name}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
