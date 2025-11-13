"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAssetList, deleteAsset, downloadAsset, uploadAsset, updateAsset } from "@utils/assetAPI";
import "@styles/asset-grid.css"; 


function getCookie(name: string) {
  if (typeof document === "undefined") return "";
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift();
  return "";
}

export default function AssetPage() {
  const [assets, setAssets] = useState<any[]>([]);
  const [role, setRole] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  function isImageFile(filename: string) {
    return /\.(jpg|jpeg|png|gif|bmp|webp|svg)$/i.test(filename);
  }

  useEffect(() => {
    setRole(getCookie("role") || null);
    setUsername(getCookie("username") || null);
    fetchAssets();
  }, []);

  async function fetchAssets() {
    setLoading(true);
    try {
      const list = await getAssetList(searchQuery, 0, 50);
      setAssets(Array.isArray(list) ? list : list.assets || list.results || []);
    } catch (err) {
      console.error("Failed to fetch assets:", err);
      alert("Failed to load assets");
    } finally {
      setLoading(false);
    }
  }

  async function handleUpload(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedFile || !title) {
      alert("Title and file required");
      return;
    }
    const fd = new FormData();
    fd.append("file", selectedFile);
    fd.append("title", title);
    try {
      await uploadAsset(fd);
      setTitle("");
      setSelectedFile(null);
      await fetchAssets();
      alert("Upload successful");
    } catch (err) {
      console.error("Upload failed:", err);
      alert("Upload failed");
    }
  }

  function canModify(asset: any) {
    if (!role) return false;
    return role === "admin" || role === "editor";
  }

  return (
    <div className="asset-grid-container">
      {/* Header */}
      <header className="asset-header">
        <div className="header-content">
          <h1>Assets</h1>
          {username && (
            <div className="user-info">
              <span>Welcome, {username}</span>
              {role && <span className="role-badge">{role}</span>}
            </div>
          )}
        </div>
        
        {/* Search Bar */}
        <div className="search-section">
          <input
            type="text"
            placeholder="Search assets..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
          <button onClick={fetchAssets} className="search-button">
            Search
          </button>
        </div>

        {/* Upload for Admins/Editors */}
        {(role === "admin" || role === "editor") && (
          <div className="upload-section">
            <form onSubmit={handleUpload} className="upload-form">
              <input
                required
                placeholder="Asset title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="title-input"
              />
              <input
                type="file"
                required
                onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                className="file-input"
              />
              <button type="submit" className="upload-button">
                Upload
              </button>
            </form>
          </div>
        )}
      </header>

      {/* Asset Grid */}
      <main className="asset-grid-main">
        {loading ? (
          <div className="loading">Loading assets...</div>
        ) : assets.length === 0 ? (
          <div className="empty-state">
            <h2>No assets found</h2>
            <p>{(role === "admin" || role === "editor") ? "Upload your first asset!" : "Check back later for new content."}</p>
          </div>
        ) : (
          <div className="asset-grid">
            {assets.map((asset) => (
              <div 
                key={asset.id} 
                className="asset-card"
                onClick={() => router.push(`/asset/${encodeURIComponent(String(asset.id))}`)}
              >
                <div className="thumbnail">
                  {isImageFile(asset.file_name) && asset.asset_url ? (
                    <img 
                      src={asset.asset_url} 
                      alt={asset.title}
                      className="thumbnail-image"
                      onError={(e) => {
                        // If image fails to load, show placeholder
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.nextSibling.style.display = 'flex';
                      }}
                    />
                  ) : null}
                  <div className="thumbnail-placeholder">
                    {asset.title?.charAt(0).toUpperCase() || 'A'}
                  </div>
                </div>
                <div className="asset-info">
                  <h3 className="asset-title">{asset.title}</h3>
                  <p className="asset-owner">By {asset.owner?.username || "Unknown"}</p>
                  <p className="asset-filename">{asset.file_name}</p>
                </div>
                <div className="asset-actions">
                  {asset.asset_url && asset.asset_url.startsWith("http") && (
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        downloadAsset(asset.asset_url, asset.title);
                      }}
                      className="action-button download"
                    >
                      Download
                    </button>
                  )}
                  {canModify(asset) && (
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        if (confirm("Delete this asset?")) {
                          deleteAsset(asset.id).then(fetchAssets);
                        }
                      }}
                      className="action-button delete"
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}