import { apiFetch } from "@utils/fetchInterceptor";

// Get all assets
export async function getAssetList() {
  const res = await apiFetch("/api/asset/list/");
  if (!res.ok) throw new Error("Failed to fetch assets");
  return res.json();
}

// Get single asset
export async function getAssetById(id: string) {
  const res = await apiFetch(`/api/asset/${id}/`);
  if (!res.ok) throw new Error("Failed to fetch asset");
  return res.json();
}

// Create new asset
export async function createAsset(data: any) {
  const res = await apiFetch("/api/asset/", {
    method: "POST",
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create asset");
  return res.json();
}

// Update asset
export async function updateAsset(id: string, data: any) {
  const res = await apiFetch(`/api/asset/${id}/`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update asset");
  return res.json();
}

// Delete asset
export async function deleteAsset(id: string) {
  const res = await apiFetch(`/api/asset/${id}/`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete asset");
  return true;
}


