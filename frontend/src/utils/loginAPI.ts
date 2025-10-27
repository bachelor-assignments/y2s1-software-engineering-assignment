import { apiFetch } from "@utils/fetchInterceptor";

export async function loginUser(username: string, password: string) {
  const response = await apiFetch("/api/auth/token/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  if (!response.ok) {
    throw new Error("Login failed");
  }

  const data = await response.json();
  return data;
}