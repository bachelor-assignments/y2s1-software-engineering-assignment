"use client";
import { useEffect, useState } from "react";

export default function AssetDetail({ params }: { params: { id: string } }) {
  const [asset, setAsset] = useState<any>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch(`http://localhost:8000/api/assets/${params.id}/`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(setAsset);
  }, [params.id]);

  if (!asset) return <p>Loading...</p>;

  return (
    <main>
      <h1>{asset.name}</h1>
      <p>{asset.description}</p>
      {asset.is_owner && <a href={`/upload?id=${asset.id}`}>Edit</a>}
    </main>
  );
}
