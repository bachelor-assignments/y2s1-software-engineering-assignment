import { useState, useEffect } from "react";
import AssetGrid from "@components/AssetGrid";
import UploadAsset from "@components/UploadAsset";
import { getAssetList } from "@utils/assetAPI";
import "./page.css";

export default function HomePage() {
  const [allAssets, setAllAssets] = useState<any[]>([]);
  const [filteredAssets, setFilteredAssets] = useState<any[]>([]);
  const [showUpload, setShowUpload] = useState(false);

  useEffect(() => {
    const fetchAssets = async () => {
      const req = await getAssetList();
      const assets = await req.json();
      setAllAssets(assets);
      setFilteredAssets(assets);
    };

    fetchAssets();
    }, []);

    // Set up search listener
    const searchInput = document.getElementById(
      "global-search"
    ) as HTMLInputElement;
    if (!searchInput) return;

    const handleSearch = () => {
      const query = searchInput.value.toLowerCase().trim();
      if (query === "") {
        setFilteredAssets(allAssets);
      } else {
        const results = allAssets.filter((asset) =>
          asset.title?.toLowerCase().includes(query)
        );
        setFilteredAssets(results);
      }
    };

    searchInput.addEventListener("input", handleSearch);
    return () => searchInput.removeEventListener("input", handleSearch);
  }, [allAssets]);

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
