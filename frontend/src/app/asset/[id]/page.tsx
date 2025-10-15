"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function AssetDetail({ params }: { params: { id: string } }) {
  const [asset, setAsset] = useState<any>(null);
  const [error, setError] = useState<string | null>(null); // for error message
  const [loading, setLoading] = useState(true); // for loading state

  useEffect(() => {
    const fetchAsset = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`http://localhost:8000/api/assets/${params.id}/`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch: ${response.status}`);
        }

        const data = await response.json();
        setAsset(data);
      } catch (err: any) {
        console.error("Error fetching asset:", err);
        setError("Failed to load asset. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchAsset();
  }, [params.id]);

  // 1️⃣ Loading state
  if (loading) return <p>Loading...</p>;

  // 2️⃣ Error state
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  // 3️⃣ Success state
  if (!asset) return <p>No asset found.</p>;

  return (
    <main>
      <h1>{asset.name}</h1>
      <p>{asset.description}</p>
      {asset.is_owner && (
        <Link href={`/upload?id=${asset.id}`}>
          Edit
        </Link>
      )}
    </main>
  );
}
