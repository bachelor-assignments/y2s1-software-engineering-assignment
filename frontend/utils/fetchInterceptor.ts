export async function apiFetch(url: string, options: RequestInit = {}) {
  const accessToken = localStorage.getItem("access_token");
  const refreshToken = localStorage.getItem("refresh_token");

  let headers = {
    "Content-Type": "application/json",
    ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    ...options.headers,
  };

  try {
    let response = await fetch(url, { ...options, headers });

    if (response.status === 401 && refreshToken) {
      console.warn("Access token expired. Trying refresh...");

      const newToken = await refreshAccessToken(refreshToken);

      if (newToken) {
        localStorage.setItem("access_token", newToken);

        headers = {
          ...headers,
          Authorization: `Bearer ${newToken}`,
        };
        response = await fetch(url, { ...options, headers });
      } else {
        throw new Error("Session expired. Please log in again.");
      }
    }

    if (!response.ok) {
      throw new Error(`HTTP Error ${response.status}`);
    }

    return await response.json();
  } catch (err) {
    console.error("Fetch failed:", err);
    throw err;
  }
}

async function refreshAccessToken(refreshToken: string) {
  try {
    const response = await fetch("/api/auth/token/refresh/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh: refreshToken }),
    });

    if (!response.ok) return null;

    const data = await response.json();
    return data.access; 
  } catch (err) {
    console.error("Token refresh failed:", err);
    return null;
  }
}
