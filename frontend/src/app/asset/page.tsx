"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  getAssetList,
  deleteAsset,
  downloadAsset,
  uploadAsset,
} from "@utils/assetAPI";

// small helper to read cookies (no external lib)
function getCookie(name: string) {
  const v = typeof document === "undefined" ? "" : document.cookie;
  return v
    .split("; ")
    .find((row) => row.startsWith(name + "="))
    ?.split("=")[1];
}

export default function AssetPage() {
  const [assets, setAssets] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [pageIndex] = useState(0);
  const [pageSize] = useState(20);
  const [role, setRole] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // read role and username cookie set by backend
    const r = getCookie("role") || null;
    const u = getCookie("username") || null;
    setRole(r);
    setUsername(u);
    fetchAssets();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function fetchAssets() {
    setLoading(true);
    try {
      const res = await getAssetList(search, pageIndex, pageSize);
      // backend may return array or { results: [...] }
      const list = Array.isArray(res) ? res : res.results || res;
      setAssets(list);
    } catch (err) {
      console.error("Failed to fetch assets:", err);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(asset_url: string) {
    if (!confirm("Delete this asset?")) return;
    try {
      await deleteAsset(asset_url);
      await fetchAssets();
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Delete failed");
    }
  }

  async function handleDownload(file_url: string, title?: string) {
    try {
      await downloadAsset(file_url, title);
    } catch (err) {
      console.error("Download failed:", err);
      alert("Download failed");
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
      console.error("Upload error:", err);
      alert("Upload failed");
    }
  }

  // show edit prompt for title/metadata
  async function handleEdit(asset: any) {
    const newTitle = prompt("New title", asset.title || "");
    if (!newTitle || newTitle === asset.title) return;
    try {
      await fetch(`/api/asset/${encodeURIComponent(asset.asset_url)}/`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: newTitle }),
      });
      await fetchAssets();
      alert("Updated");
    } catch (err) {
      console.error("Update failed:", err);
      alert("Update failed");
    }
  }

  // permission: admin/editor can edit/delete any; others can only edit/delete own uploads
  function canModify(asset: any) {
    if (!role) return false;
    if (role === "admin" || role === "editor") return true;
    // viewer can modify their own upload only
    if (asset.owner?.username && username && asset.owner.username === decodeURIComponent(username))
      return true;
    return false;
  }

  return (
    <main style={{ padding: 20 }}>
      <h1>Assets</h1>

      <div style={{ marginBottom: 12 }}>
        <input
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button onClick={() => fetchAssets()} style={{ marginLeft: 8 }}>
          Search
        </button>
      </div>

      {/* Upload form - allowed for all roles per your rule */}
      <section style={{ marginBottom: 20 }}>
        <h3>Upload (all roles)</h3>
        <form onSubmit={handleUpload}>
          <input
            required
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <input
            type="file"
            required
            onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
          />
          <button type="submit">Upload</button>
        </form>
      </section>

      {/* Admin panel button shown only if role is admin */}
      {role === "admin" && (
        <div style={{ marginBottom: 10 }}>
          <Link href="/admin">
            <button>Admin Panel</button>
          </Link>
        </div>
      )}

      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul>
          {assets.map((a) => (
            <li key={a.asset_url} style={{ marginBottom: 8 }}>
              <strong>{a.title}</strong> — owner: {a.owner?.username || "—"}
              {"  "}
              <Link href={`/asset/${encodeURIComponent(a.asset_url)}`}>
                <button style={{ marginLeft: 8 }}>Preview</button>
              </Link>
              {"  "}
              {a.asset_url && a.asset_url.startsWith("http") ? (
                <button
                  onClick={() => handleDownload(a.asset_url, a.title)}
                  style={{ marginLeft: 6 }}
                >
                  Download
                </button>
              ) : (
                <a href={a.asset_url} target="_blank" rel="noreferrer" style={{ marginLeft: 6 }}>
                  Open
                </a>
              )}

              {canModify(a) && (
                <>
                  <button onClick={() => handleEdit(a)} style={{ marginLeft: 6 }}>
                    Edit
                  </button>
                  <button onClick={() => handleDelete(a.asset_url)} style={{ marginLeft: 6 }}>
                    Delete
                  </button>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
