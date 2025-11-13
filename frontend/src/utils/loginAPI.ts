import { apiFetch } from "@utils/fetchInterceptor";

export async function loginUser(username: string, password: string) {
  const response = await apiFetch("/api/auth/token/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
    credentials: "include", 
  });

  if (!response.ok) {
    const errorData = await response.text();
    throw new Error(`Login failed: ${errorData || response.statusText}`);
  }

  const data = await response.json();
  return data;
}
