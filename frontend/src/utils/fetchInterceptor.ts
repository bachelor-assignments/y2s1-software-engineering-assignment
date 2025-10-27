export async function apiFetch(
  path: string,
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

  const BACKEND_BASE_URL = process.env.DJANGO_DOCKER_CONTAINER_NAME

  let response = await fetch(`${BACKEND_BASE_URL}${path}`, opts);

  // If unauthorized → try refresh
  if (response.status === 401) {
    console.warn("Access token expired. Attempting refresh...");

    const refreshResponse = await fetch("/api/token/refresh/", {
      method: "POST",
      credentials: "include",
    });

    // retry original request
    if (refreshResponse.ok) {
      response = await fetch(`${BACKEND_BASE_URL}${path}`, opts);
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
