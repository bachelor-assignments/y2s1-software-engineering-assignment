import { apiFetch } from "@utils/fetchInterceptor";

// Get all users
export async function getUsers() {
  const res = await apiFetch("/api/user/list/");
  if (!res.ok) throw new Error("Failed to fetch users");
  return res.json();
}


// Create user
export async function createUser(userData: any) {
  console.log("Creating user with:", userData);
  const res = await apiFetch("/api/user/", {
    method: "POST",
    body: JSON.stringify(userData),
  });
  console.log("Response status:", res.status);
  if (!res.ok) {
    const errorText = await res.text();
    console.error("Error response from backend:", errorText);
    throw new Error("Failed to create user");
  }
  return res.json();
}

// Update user
export async function updateUser(id: string, userData: any) {
  const res = await apiFetch(`/api/user/${id}/`, {
    method: "PUT",
    body: JSON.stringify(userData),
  });

  const text = await res.text();
  console.log("Update user debug:", res.status, text);

  if (!res.ok) {
    let errMsg = "Failed to update user";
    try {
      const err = JSON.parse(text);
      errMsg = err.detail || JSON.stringify(err);
    } catch {
      errMsg = text || errMsg;
    }
    throw new Error(errMsg);
  }

  return JSON.parse(text);
}


// Delete user
export async function deleteUser(id: string) {
  const res = await apiFetch(`/api/user/${id}/`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete user");
  return true;
}
