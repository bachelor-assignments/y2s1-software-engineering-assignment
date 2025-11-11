"use client";

import { useRouter, usePathname } from "next/navigation";
import { logoutUser } from "@utils/logoutAPI";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import "../styles/NavBar.css";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();

  const [mounted, setMounted] = useState(false);
  const [role, setRole] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);

  // ✅ Mount fix + cookie update when pathname changes
  useEffect(() => {
    setMounted(true);
    const currentRole = Cookies.get("role") || null;
    const currentUsername = Cookies.get("username") || null;
    setRole(currentRole);
    setUsername(currentUsername);
  }, [pathname]); // re-run when page changes (including after login redirect)

  if (!mounted || pathname === "/login") return null;

  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch (err) {
      console.error("Logout failed:", err);
    } finally {
      Cookies.remove("access_token");
      Cookies.remove("refresh_token");
      Cookies.remove("role");
      Cookies.remove("username");
      router.push("/login");
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <span className="navbar-brand" onClick={() => router.push("/asset")}>
          DAM System
        </span>

        <button
          className={`nav-btn ${pathname.startsWith("/asset") ? "active" : ""}`}
          onClick={() => router.push("/asset")}
        >
          Assets
        </button>

        {role === "admin" && (
          <button
            className={`nav-btn ${pathname.startsWith("/admin") ? "active" : ""}`}
            onClick={() => router.push("/admin")}
          >
            Admin
          </button>
        )}
      </div>

      <div className="navbar-right">
        <span className="username">{username || "Guest"}</span>
        <button className="nav-btn logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </nav>
  );
}
