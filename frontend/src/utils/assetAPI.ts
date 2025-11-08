import { apiFetch } from "@utils/fetchInterceptor";

const BACKEND_BASE_URL = process.env.NEXT_PUBLIC_DJANGO_BACKEND_URL || "http://localhost:8237";

// --- Upload ---
export async function uploadAsset(formData: FormData) {
  const res = await fetch(`${BACKEND_BASE_URL}/api/asset/`, {
    method: "POST",
    body: formData,
    credentials: "include",
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Failed to upload asset");
  }
  return res.json();
}

// --- List assets (metadata search only) ---
export async function getAssetList(metadataSearch = "", page_index = 0, page_size = 20) {
  const params = new URLSearchParams();
  if (metadataSearch) params.set("metadata", metadataSearch);
  params.set("page_index", String(page_index));
  params.set("page_size", String(page_size));

  const res = await apiFetch(`/api/asset/list/?${params.toString()}`);
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Failed to fetch assets");
  }
  const data = await res.json();
  const assetsArray = Array.isArray(data) ? data : data.assets || data.results || [];

  // Ensure owner is always an object with username to prevent "—" display
  return assetsArray.map(a => ({
    ...a,
    owner: a.owner ? { username: a.owner } : { username: "—" },
  }));
}

// --- Get asset detail ---
export async function getAssetDetail(fileNameOrUrl: string) {
  const encoded = encodeURIComponent(fileNameOrUrl);
  try {
    const res = await apiFetch(`/api/asset/${encoded}/`);
    if (res.ok) return res.json();
  } catch {}
  const list = await getAssetList("", 0, 20);
  const arr = Array.isArray(list) ? list : list.assets || list.results || [];
  const found = arr.find(a => a.file_name === fileNameOrUrl || a.asset_url === fileNameOrUrl);
  if (!found) throw new Error("Asset not found");
  return found;
}

// --- Versions ---
export async function getAssetVersions(fileName: string) {
  const encoded = encodeURIComponent(fileName);
  const res = await apiFetch(`/api/asset/${encoded}/versions/`, {
    credentials: "include", // <-- add this line
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Failed to fetch asset versions");
  }
  return res.json();
}

// Delete asset
export async function deleteAsset(assetId: number) {
  const res = await apiFetch(`/api/asset/${assetId}/`, { method: "DELETE", credentials: "include" });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Failed to delete asset");
  }
  return true;
}

// Update asset
export async function updateAsset(assetId: number, data: any) {
  const res = await apiFetch(`/api/asset/${assetId}/`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
    credentials: "include",
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Failed to update asset");
  }
  return res.json();
}

// --- Download asset ---
export async function downloadAsset(file_url: string, filename?: string) {
  const res = await fetch(file_url, { credentials: "include" });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Failed to download file");
  }
  const blob = await res.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename || (file_url.split("/").pop() || "download");
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.URL.revokeObjectURL(url);
}
