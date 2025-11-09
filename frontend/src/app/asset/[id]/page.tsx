"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  getAssetDetail,
  getAssetVersions,
  deleteAsset,
  downloadAsset,
  updateAsset,
} from "@utils/assetAPI";

function getCookie(name: string) {
  const v = typeof document === "undefined" ? "" : document.cookie;
  return v
    .split("; ")
    .find((row) => row.startsWith(name + "="))
    ?.split("=")[1];
}

export default function AssetDetail() {
  const params = useParams();
  const assetId = params?.id as string; 
  const [asset, setAsset] = useState<any | null>(null);
  const [versions, setVersions] = useState<any[]>([]);
  const [role, setRole] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    setRole(getCookie("role") || null);
    setUsername(getCookie("username") || null);
    fetchAll();
  }, [assetId]);

  async function fetchAll() {
    try {
      const d = await getAssetDetail(assetId);
      setAsset(d);
      const v = await getAssetVersions(assetId); 
      setVersions(Array.isArray(v) ? v : v.results || v);
    } catch (err) {
      console.error("Fetch asset failed:", err);
    }
  }

  function canModify() {
    if (!asset) return false;
    if (role === "admin" || role === "editor") return true;
    if (asset.owner?.username && username && asset.owner.username === decodeURIComponent(username)) return true;
    return false;
  }

  async function onDownload() {
    if (!asset?.asset_url) return alert("No file URL");
    try {
      await downloadAsset(asset.asset_url, asset.title);
    } catch (err) {
      console.error("Download error:", err);
      alert("Download failed");
    }
  }

  async function onEdit() {
    const newTitle = prompt("New title", asset?.title || "");
    if (!newTitle || newTitle === asset?.title) return;
    try {
      await updateAsset(asset.id, { title: newTitle }); 
      await fetchAll();
      alert("Updated");
    } catch (err) {
      console.error("Update failed:", err);
      alert("Update failed");
    }
  }

  async function onDelete() {
    if (!confirm("Delete this asset?")) return;
    try {
      await deleteAsset(asset.id);  
      router.push("/asset");
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Delete failed");
    }
  }

  if (!asset) return <p>Loading...</p>;

  const url = asset.asset_url;
  const isImage = /\.(jpg|jpeg|png|gif|bmp|webp)$/i.test(url);
  const isPdf = /\.pdf$/i.test(url);
  const isVideo = /\.(mp4|webm|ogg)$/i.test(url);

  return (
    <main style={{ padding: 20 }}>
      <h1>{asset.title}</h1>
      <p>Owner: {asset.owner?.username || "—"}</p>
      <p>Updated at: {new Date(asset.updated_at).toLocaleString()}</p>

      <div style={{ marginTop: 12 }}>
        {isImage && <img src={url} alt={asset.title} style={{ maxWidth: "100%", height: "auto" }} />}
        {isPdf && <iframe src={url} style={{ width: "100%", height: 600 }} title="PDF Preview" />}
        {isVideo && (
          <video controls style={{ maxWidth: "100%" }}>
            <source src={url} />
            Your browser does not support video.
          </video>
        )}
        {!isImage && !isPdf && !isVideo && (
          <div>
            <a href={url} target="_blank" rel="noreferrer">
              Open file
            </a>
          </div>
        )}
      </div>

      <div style={{ marginTop: 12 }}>
        <button onClick={onDownload}>Download</button>
        {canModify() && <button onClick={onEdit} style={{ marginLeft: 8 }}>Edit</button>}
        {canModify() && <button onClick={onDelete} style={{ marginLeft: 8 }}>Delete</button>}
      </div>

      <section style={{ marginTop: 24 }}>
        <h3>Version History</h3>
        {versions.length === 0 ? (
          <p>No previous versions.</p>
        ) : (
          <ul>
            {versions.map((v) => (
              <li key={v.id}>
                {v.title} — by {v.updated_by} at {new Date(v.updated_at).toLocaleString()}
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
