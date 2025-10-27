import AssetCard from "./AssetCard";
import "./asset-grid.css";

export default function AssetGrid({ assets }: { assets: any[] }) {
  if (assets.length === 0) {
    return <p className="empty-message">No assets available yet.</p>;
  }

  return (
    <div className="asset-grid">
      {assets.map((asset) => (
        <AssetCard
          key={asset.id}
          assetId={asset.id}
          title={asset.title || "Untitled"}
          ownerName={asset.owner?.name || "Unknown"}
          ownerRole={asset.owner?.role || "Viewer"}
        />
      ))}
    </div>
  );
}
