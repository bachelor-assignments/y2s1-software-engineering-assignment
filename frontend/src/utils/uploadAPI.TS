// import { apiFetch } from "@utils/fetchInterceptor";

// export async function uploadFile(formData: FormData) {
//   const token = localStorage.getItem("token");

//   try {
//     const response = await fetch("/api/asset/list", {
//       method: "POST",
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//       body: formData,
//     });

//     if (!response.ok) {
//       throw new Error("Upload failed");
//     }

//     return await response.json();
//   } catch (err) {
//     console.error("Upload error:", err);
//     throw err;
//   }
// }


/* 
import { apiFetch } from "@utils/fetchInterceptor";

export async function uploadFile(formData: FormData) {
  try {
    const res = await apiFetch("/api/asset/upload/", {
      method: "POST",
      body: formData,
      // Don’t set Content-Type manually, browser will set it for multipart/form-data
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Upload failed: ${errText || res.statusText}`);
    }

    return await res.json();
  } catch (err: any) {
    console.error("Upload error:", err);
    throw new Error(err.message || "Upload failed.");
  }
}

*/