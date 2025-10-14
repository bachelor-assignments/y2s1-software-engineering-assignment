"use client";
import { useEffect, useState } from "react";

export default function AssetListPage() {
  const [assets, setAssets] = useState<any[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch("http://localhost:8000/api/assets/", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(setAssets);
  }, []);

  const filtered = assets.filter(a => a.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <main>
      <h1>Assets</h1>
      <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search..." />
      <ul>
        {filtered.map(asset => (
          <li key={asset.id}>
            <a href={`/assets/${asset.id}`}>{asset.name}</a>
          </li>
        ))}
      </ul>
      <a href="/upload">Upload New Asset</a>
    </main>
  );
}
