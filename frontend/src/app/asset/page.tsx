"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { getAssetList, deleteAsset, downloadAsset, uploadAsset, updateAsset } from "@utils/assetAPI";

// read role & username from cookie
function getCookie(name: string) {
  const v = typeof document === "undefined" ? "" : document.cookie;
  return v
    .split("; ")
    .find((row) => row.startsWith(name + "="))
    ?.split("=")[1];
}

export default function AssetPage() {
  const [assets, setAssets] = useState<any[]>([]);
  const [metadataSearch, setMetadataSearch] = useState("");
  const [role, setRole] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setRole(getCookie("role") || null);
    setUsername(getCookie("username") || null);
    fetchAssets();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function fetchAssets() {
    setLoading(true);
    try {
      const list = await getAssetList(metadataSearch, 0, 20);
      setAssets(Array.isArray(list) ? list : list.assets || list.results || []);
    } catch (err) {
      console.error("Failed to fetch assets:", err);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(asset_id: number) {
    if (!confirm("Delete this asset?")) return;
    try {
      await deleteAsset(asset_id);
      await fetchAssets();
      alert("Deleted successfully");
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Delete failed");
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
    if (role === "admin" || role === "editor") return true;
    return asset.owner?.username === decodeURIComponent(username || "");
  }

  return (
    <main style={{ padding: 20 }}>
      <h1>Assets</h1>

      {/* Metadata search */}
      <div style={{ marginBottom: 12 }}>
        <input
          placeholder='Search metadata e.g. {"category":"report"}'
          value={metadataSearch}
          onChange={(e) => setMetadataSearch(e.target.value)}
        />
        <button onClick={fetchAssets} style={{ marginLeft: 8 }}>Search</button>
      </div>

      {/* Upload */}
      <section style={{ marginBottom: 20 }}>
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

      {/* Admin panel */}
      {role === "admin" && (
        <div style={{ marginBottom: 10 }}>
          <Link href="/admin"><button>Admin Panel</button></Link>
        </div>
      )}

      {/* Asset list */}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul>
          {assets.map((a) => (
            <li key={a.file_name} style={{ marginBottom: 8 }}>
              <strong>{a.title}</strong> — owner: {a.owner?.username || "—"}{" "}
              <Link href={`/asset/${encodeURIComponent(a.file_name)}`}><button style={{ marginLeft: 8 }}>Preview</button></Link>
              {a.asset_url && a.asset_url.startsWith("http") && (
                <button onClick={() => downloadAsset(a.asset_url, a.title)} style={{ marginLeft: 6 }}>Download</button>
              )}
              {canModify(a) && (
                <>
                  {/* Edit button */}
                  <button
                    style={{ marginLeft: 6 }}
                    onClick={async () => {
                      const newTitle = prompt("New title", a.title || "");
                      if (!newTitle || newTitle === a.title) return;
                      try {
                        await updateAsset(a.id, { title: newTitle }); // <-- use id
                        await fetchAssets();
                        alert("Updated successfully");
                      } catch (err) {
                        console.error("Update failed:", err);
                        alert("Update failed");
                      }
                    }}
                  >
                    Edit
                  </button>

                  {/* Delete button */}
                  <button
                    style={{ marginLeft: 6 }}
                    onClick={async () => {
                      if (!confirm("Delete this asset?")) return;
                      try {
                        await deleteAsset(a.id); // <-- use id
                        await fetchAssets();
                        alert("Deleted successfully");
                      } catch (err) {
                        console.error("Delete failed:", err);
                        alert("Delete failed");
                      }
                    }}
                  >
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
