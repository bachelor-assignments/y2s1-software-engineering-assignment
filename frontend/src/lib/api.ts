//for client side
const PUBLIC_BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_PUBLIC_URL || 'http://localhost:8237';

//for srver side
const SERVER_BACKEND_URL = 'http://5005cmd-backend';

//used in page.tsx
export async function getPublicAssets() {
  try {
    // Server-side internal docker URL
    const res = await fetch(`${SERVER_BACKEND_URL}/api/asset/list/`);
    console.log(res.status)
    if (!res.ok) throw new Error('Failed to fetch assets');
    const data = await res.json();
    return data.results || data;
  } catch (error) {
    console.error('Error fetching assets:', error);
    return [];
  }
}

// components in client side
export async function uploadAsset(file: File, title: string, token: string) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('title', title);
  const res = await fetch(`${PUBLIC_BACKEND_URL}/asset/`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });
  return res.json();
}

export async function deleteAsset(assetId: number, token: string) {
  const res = await fetch(`${PUBLIC_BACKEND_URL}/asset/${assetId}/`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.ok;
}