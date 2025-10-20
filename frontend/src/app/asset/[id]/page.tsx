"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { getAssetById } from "@utils/assetAPI";

export default function AssetDetail({ params }: { params: { id: string } }) {
  const [asset, setAsset] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAsset = async () => {
      try {
        const data = await getAssetById(params.id);
        setAsset(data);
      } catch (err) {
        console.error("Error fetching asset:", err);
        setError("Failed to load asset. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchAsset();
  }, [params.id]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!asset) return <p>No asset found.</p>;

  return (
    <main>
      <h1>{asset.name}</h1>
      <p>{asset.description}</p>
      {asset.is_owner && (
        <Link href={`/upload?id=${asset.id}`}>Edit</Link>
      )}
    </main>
  );
}
