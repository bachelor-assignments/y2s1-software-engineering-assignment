"use client";

import { useState } from "react";
import UploadAsset from "./UploadAsset";

export default function Header() {
  const [showUpload, setShowUpload] = useState(false);

  return (
    <>
      <header className="dam-header">
        <a href="/" className="logo-link">
          <h1>DAM</h1>
        </a>
        <div className="search-container">
          <input
            type="text"
            placeholder="Search assets..."
            className="search-input"
            id="global-search"
          />
        </div>
        <div className="upload-button-container">
          <button className="upload-button" onClick={() => setShowUpload(true)}>
            Upload New Asset
          </button>
        </div>
      </header>

      {showUpload && <UploadAsset onClose={() => setShowUpload(false)} />}
    </>
  );
}
