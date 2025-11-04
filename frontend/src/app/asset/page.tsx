"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Cookies from "js-cookie";
import { getAssetList } from "@utils/assetAPI";
import AdminDashboard from "@/app/admin/page"; 
import "@styles/asset.css";

export default function AssetPage() {
  const [assets, setAssets] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [username, setUsername] = useState("");
  const [role, setRole] = useState("");

  useEffect(() => {
    const user = Cookies.get("username");
    const userRole = Cookies.get("role");

    if (user) setUsername(user);
    if (userRole) setRole(userRole);
  }, []);

  useEffect(() => {
    const fetchAssets = async () => {
      try {
        setLoading(true);
        setError(null);

        const data = await getAssetList();
        setAssets(data);
      } catch (err: any) {
        console.error("Error fetching assets:", err);
        setError("Failed to fetch assets.");
      } finally {
        setLoading(false);
      }
    };

    fetchAssets();
  }, []);

  const filtered = assets.filter((a) =>
    a.name?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <main><p>Loading assets...</p></main>;
  if (error) return <main><p style={{ color: "red" }}>{error}</p></main>;

  return (
    <main style={{ padding: "20px" }}>
      <h1>Welcome, {username || "User"}</h1>
      <p>Role: {role || "unknown"}</p>

      <section>
        <h2>Assets</h2>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search assets..."
          style={{ marginBottom: "10px", padding: "5px" }}
        />

        <ul>
          {filtered.map((asset) => (
            <li key={asset.id}>
              <Link href={`/asset/${asset.id}`}>{asset.name}</Link>
            </li>
          ))}
        </ul>

        <Link href="/upload">📤 Upload New Asset</Link>
      </section>

      {role === "admin" && (
        <section style={{ marginTop: "40px", borderTop: "2px solid #ddd", paddingTop: "20px" }}>
          <AdminDashboard />
        </section>
      )}
    </main>
  );
}
