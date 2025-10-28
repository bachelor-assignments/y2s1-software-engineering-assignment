'use client'

import { useState, useEffect } from "react";
import AssetGrid from "@components/AssetGrid";
import UploadAsset from "@components/UploadAsset";
import { getAssetList } from "@utils/assetAPI";
import "./page.css";

export default function HomePage() {
  const [allAssets, setAllAssets] = useState<any[]>([]);
  const [filteredAssets, setFilteredAssets] = useState<any[]>([]);
  const [showUpload, setShowUpload] = useState(false);



  return (
    <div className="homepage">
      <div className="hero">
        <h1>Digital Asset Library</h1>
        <p>Browse and upload videos, images, and documents.</p>
      </div>

      <div className="asset-section">
        <AssetGrid assets={filteredAssets} />
      </div>

      <button
        className="floating-upload-button"
        onClick={() => setShowUpload(true)}
      >
        Upload New Asset
      </button>

      {showUpload && <UploadAsset onClose={() => setShowUpload(false)} />}
    </div>
  );
}
