import { apiFetch } from "@utils/fetchInterceptor";

// Upload new asset (formData should contain "file", "title", optional "metadata")
export async function uploadAsset(formData: FormData) {
  // Ensure you have NEXT_PUBLIC_API_URL in your .env
  const backendUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8237";

  // We must NOT send "Content-Type": "application/json" for FormData
  const res = await fetch(`${backendUrl}/api/asset/`, {
    method: "POST",
    body: formData,
    credentials: "include", // include cookies for auth
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Failed to upload asset");
  }

  return res.json();
}


// Get paginated asset list with optional search
export async function getAssetList(search = "", page_index = 0, page_size = 20) {
  const params = new URLSearchParams();
  if (search) params.set("search", search);
  params.set("page_index", String(page_index));
  params.set("page_size", String(page_size));

  const res = await apiFetch(`/api/asset/list/?${params.toString()}`);
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Failed to fetch assets");
  }
  return res.json();
}

// Get single asset detail
export async function getAssetDetail(asset_url: string) {
  const encoded = encodeURIComponent(asset_url);
  const res = await apiFetch(`/api/asset/${encoded}/`);
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Failed to fetch asset detail");
  }
  return res.json();
}

// Get versions for an asset
export async function getAssetVersions(asset_url: string) {
  const encoded = encodeURIComponent(asset_url);
  const res = await apiFetch(`/api/asset/${encoded}/versions/`);
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Failed to fetch asset versions");
  }
  return res.json();
}

// Update asset (title / metadata etc.)
export async function updateAsset(asset_url: string, data: any) {
  const encoded = encodeURIComponent(asset_url);
  const res = await apiFetch(`/api/asset/${encoded}/`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Failed to update asset");
  }
  return res.json();
}

// Delete asset
export async function deleteAsset(asset_url: string) {
  const encoded = encodeURIComponent(asset_url);
  const res = await apiFetch(`/api/asset/${encoded}/`, {
    method: "DELETE",
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Failed to delete asset");
  }
  return true;
}

// Download asset file (fetch blob and trigger download)
export async function downloadAsset(file_url: string, filename?: string) {
  // If the backend returns a full file_url, we fetch it directly.
  // Note: If your file_url is a MinIO signed url or public URL, this will work.
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
