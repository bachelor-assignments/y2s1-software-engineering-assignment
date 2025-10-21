"use client";
import Link from "next/link";
import "@styles/navbar.css";

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-logo">MyApp</div>
      <div className="navbar-links">
        <Link href="/">Home</Link>
        <Link href="/login">Login</Link>
        <Link href="/user">User</Link>
      </div>
    </nav>
  );
}
