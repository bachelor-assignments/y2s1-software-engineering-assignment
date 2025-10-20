import { apiFetch } from "@utils/fetchInterceptor";

export async function uploadFile(formData: FormData) {
  const token = localStorage.getItem("token");

  try {
    const response = await fetch("/api/upload", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Upload failed");
    }

    return await response.json();
  } catch (err) {
    console.error("Upload error:", err);
    throw err;
  }
}
