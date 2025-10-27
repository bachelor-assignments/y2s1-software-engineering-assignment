"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getAllAssets } from "@utils/assetAPI"; 
import "@styles/asset.css";

export default function AssetListPage() {
  const [assets, setAssets] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAssets = async () => {
      try {
        setLoading(true);
        setError(null);

        const data = await getAllAssets();
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

  const filtered = assets.filter(a =>
    a.name.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <main><p>Loading assets...</p></main>;
  if (error) return <main><p style={{ color: "red" }}>{error}</p></main>;

  return (
    <main>
      <h1>Assets</h1>
      <input
        value={search}
        onChange={e => setSearch(e.target.value)}
        placeholder="Search..."
      />
      <ul>
        {filtered.map(asset => (
          <li key={asset.id}>
            <Link href={`/assets/${asset.id}`}>{asset.name}</Link>
          </li>
        ))}
      </ul>
      <Link href="/upload">Upload New Asset</Link>
    </main>
  );
}
