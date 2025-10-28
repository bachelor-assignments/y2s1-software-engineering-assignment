'use client';

import { useState, useEffect } from 'react';
import AssetGrid from '@components/AssetGrid';
import UploadAsset from '@components/UploadAsset';
import { getAssetList } from '@utils/assetAPI';
import './page.css';

export default function HomePage() {
    const [assets, setAssets] = useState<any[]>([]);
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [search, setSearch] = useState('');

    useEffect(() => {
        (async () => {
            const res = await getAssetList();
            console.log(await res.json());
        })();
    }, []);

    const searchAsset = async () => {
        // TODO:
    };

    return (
        <>
            {/* search bar */}
            <div className="search-container">
                <input
                    type="text"
                    placeholder="Search assets..."
                    className="search-input"
                    id="global-search"
                    onChange={(e) => setSearch(e.target.value)}
                />
                <button onClick={searchAsset}>Search</button>
            </div>

            <div className="homepage">
                <div className="hero">
                    <h1>Digital Asset Library</h1>
                    <p>Browse and upload videos, images, and documents.</p>
                </div>

                <div className="asset-section">{/* <AssetGrid assets={filteredAssets} /> */}</div>

                <button className="floating-upload-button" onClick={() => setShowUploadModal(true)}>
                    Upload New Asset
                </button>

                {showUploadModal && <UploadAsset onClose={() => setShowUploadModal(false)} />}
            </div>
        </>
    );
}

