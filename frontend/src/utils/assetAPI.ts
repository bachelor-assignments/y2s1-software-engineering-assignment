import { apiFetch } from "@utils/fetchInterceptor";

export async function getAssetList() {
  return await apiFetch("/api/asset/list");
}

// export async function getAssetById(id: string) {
//   return await apiFetch(`/api/assets/${id}`);
// }

// export async function createAsset(data: any) {
//   return await apiFetch("/api/assets", {
//     method: "POST",
//     body: JSON.stringify(data),
//   });
// }

// export async function updateAsset(id: string, data: any) {
//   return await apiFetch(`/api/assets/${id}`, {
//     method: "PUT",
//     body: JSON.stringify(data),
//   });
// }

export async function deleteAsset(assetUrl: string) {
  return await apiFetch(`/api/assets/${assetUrl}`, {
    method: "DELETE",
  });
}
