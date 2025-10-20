import { apiFetch } from "@utils/fetchInterceptor";

export async function getAllUsers() {
  return await apiFetch("/api/admin/users");
}

export async function createUser(userData: any) {
  return await apiFetch("/api/admin/users", {
    method: "POST",
    body: JSON.stringify(userData),
  });
}

export async function updateUser(id: string, userData: any) {
  return await apiFetch(`/api/admin/users/${id}`, {
    method: "PUT",
    body: JSON.stringify(userData),
  });
}

export async function deleteUser(id: string) {
  return await apiFetch(`/api/admin/users/${id}`, {
    method: "DELETE",
  });
}
