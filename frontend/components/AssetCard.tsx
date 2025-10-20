"use client";
import Link from "next/link";

export default function AssetCard({ asset }: { asset: any }) {
  return (
    <div style={{ border: "1px solid #ccc", padding: 15, marginBottom: 10 }}>
      <h3>{asset.name}</h3>
      <p>{asset.description}</p>
      <Link href={`/assets/${asset.id}`}>View Details</Link>
    </div>
  );
}
