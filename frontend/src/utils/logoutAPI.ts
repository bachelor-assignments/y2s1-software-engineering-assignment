export async function logoutUser() {
  const res = await fetch("/logout/", {
    method: "POST",
    credentials: "include",
  });
  if (!res.ok) throw new Error("Logout failed");
  return await res.json();
}