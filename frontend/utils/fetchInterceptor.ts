export async function apiFetch(
  input: RequestInfo | URL,
  init: RequestInit = {}
): Promise<Response> {
  const opts: RequestInit = {
    ...init,
    credentials: "include", // send cookies
    headers: {
      "Content-Type": "application/json",
      ...(init.headers || {}),
    },
  };

  let response = await fetch(input, opts);

  // If unauthorized → try refresh
  if (response.status === 401) {
    console.warn("Access token expired. Attempting refresh...");

    const refreshResponse = await fetch("/api/token/refresh/", {
      method: "POST",
      credentials: "include",
    });

    // retry original request
    if (refreshResponse.ok) {
      response = await fetch(input, opts);
    } else {
      console.warn("Refresh failed. Logging out...");

      await fetch("/api/auth/logout/", {
        method: "POST",
        credentials: "include",
      });

      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }

      throw new Error("Session expired. Redirecting to login.");
    }
  }

  return response;
}
