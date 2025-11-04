import { apiFetch } from "@utils/fetchInterceptor";

// Get all users
export async function getUsers() {
  const res = await apiFetch("/api/user/list/");
  if (!res.ok) throw new Error("Failed to fetch users");
  return res.json();
}

// Get single user
export async function getUser(id: string) {
  const res = await apiFetch(`/api/user/${id}/`);
  if (!res.ok) throw new Error("Failed to fetch user");
  return res.json();
}

// Create user
export async function createUser(userData: any) {
  const res = await apiFetch("/api/user/", {
    method: "POST",
    body: JSON.stringify(userData),
  });
  if (!res.ok) throw new Error("Failed to create user");
  return res.json();
}

// Update user
export async function updateUser(id: string, userData: any) {
  const res = await apiFetch(`/api/user/${id}/`, {
    method: "PUT",
    body: JSON.stringify(userData),
  });
  if (!res.ok) throw new Error("Failed to update user");
  return res.json();
}

// Delete user
export async function deleteUser(id: string) {
  const res = await apiFetch(`/api/user/${id}/`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete user");
  return true;
}
