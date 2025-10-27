import { apiFetch } from "@utils/fetchInterceptor";

export async function getUsers() {
  return await apiFetch("/api/user/list/");
}

export async function getUser(id: string) {
  return await apiFetch(`/api/user/${id}/`);
}

export async function createUser(userData: any) {
  return await apiFetch("/api/user/", {
    method: "POST",
    body: JSON.stringify(userData),
  });
}

export async function updateUser(id: string, userData: any) {
  return await apiFetch(`/api/user/${id}/`, {
    method: "PUT",
    body: JSON.stringify(userData),
  });
}

export async function deleteUser(id: string) {
  return await apiFetch(`/api/user/${id}/`, {
    method: "DELETE",
  });
}

export const adminAPI = {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
};
