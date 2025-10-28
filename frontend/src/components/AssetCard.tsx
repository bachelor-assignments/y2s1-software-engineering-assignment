// frontend/src/app/components/asset/AssetCard.tsx
"use client";

import "@styles/asset-card.css";
import { deleteAsset } from "@utils/assetAPI";

export default function AssetCard({
  title,
  ownerName,
  ownerRole,
  assetId,
  onDeleted,
}: {
  title: string;
  ownerName: string;
  ownerRole: string;
  assetId: number;
  onDeleted?: () => void;
}) {
  const handleDelete = async () => {
    if (!confirm("Delete this asset?")) return;

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("You must be logged in to delete assets.");
        return;
      }

      const success = await deleteAsset(assetId, token);
      if (success) {
        alert("Asset deleted successfully!");
        onDeleted?.();
      } else {
        alert("Failed to delete asset. You may not have permission.");
      }
    } catch (err) {
      console.error("Delete error:", err);
      alert("Network error. Please try again.");
    }
  };

  return (
    <div className="asset-card">
      <div className="asset-preview">
        <span>Preview</span>
      </div>
      <div className="asset-info">
        <h3>{title}</h3>
        <p>
          by <span className="owner-name">{ownerName}</span> ({ownerRole})
        </p>
        <button onClick={handleDelete} className="delete-button">
          Delete
        </button>
      </div>
    </div>
  );
}
