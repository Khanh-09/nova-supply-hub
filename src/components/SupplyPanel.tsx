import { useState, useCallback, useEffect } from 'react';
import { useWalletContext } from '../context/WalletContext';
import { useContract } from '../hooks/useContract';
import { useToast } from '../context/ToastContext';
import {
  SUPPLY_CATALOG,
  CONTRACT_ID,
  EXAMPLE_TX_HASH,
  type SupplyItem,
} from '../lib/contract';
import DashboardStats from './DashboardStats';
import HeroBanner from './HeroBanner';
import QuickActions from './QuickActions';
import CatalogToolbar from './CatalogToolbar';
import SupplyCard from './SupplyCard';
import PurchaseModal from './PurchaseModal';
import LoadingSpinner from './LoadingSpinner';

export default function SupplyPanel() {
  const { publicKey, connected, signTransaction, connect, connecting } = useWalletContext();
  const {
    balance,
    shipmentCount,
    loading,
    phase,
    error,
    lastTxHash,
    initHub,
    purchase,
    contractConfigured,
    refreshStats,
  } = useContract(publicKey, signTransaction);
  const { showToast } = useToast();

  const [filteredItems, setFilteredItems] = useState<SupplyItem[]>(SUPPLY_CATALOG);
  const [selectedItem, setSelectedItem] = useState<SupplyItem | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [statsLoading, setStatsLoading] = useState(false);

  const handleFilterChange = useCallback((items: SupplyItem[]) => {
    setFilteredItems(items);
  }, []);

  useEffect(() => {
    if (error) {
      showToast({ type: 'error', title: 'Transaction failed', message: error });
    }
  }, [error, showToast]);

  const handlePurchase = useCallback(async () => {
    if (!selectedItem) return;
    try {
      const result = await purchase(selectedItem.id, selectedItem.price);
      showToast({
        type: 'success',
        title: 'Shipment confirmed!',
        message: `Tx ${result.hash.slice(0, 12)}…`,
        duration: 8000,
      });
      setModalOpen(false);
      setSelectedItem(null);
    } catch {
      // toast via error effect
    }
  }, [selectedItem, purchase, showToast]);

  const openPurchase = (item: SupplyItem) => {
    if (!connected) {
      showToast({ type: 'info', title: 'Connect wallet first' });
      return;
    }
    setSelectedItem(item);
    setModalOpen(true);
  };

  const handleRefreshStats = async () => {
    setStatsLoading(true);
    await refreshStats();
    setStatsLoading(false);
  };

  return (
    <section className="supply-panel">
      <DashboardStats
        balance={balance}
        shipmentCount={shipmentCount}
        contractConfigured={contractConfigured}
        contractId={CONTRACT_ID}
        loading={statsLoading}
      />

      {!contractConfigured && (
        <div className="alert alert-warn animate-in">
          <strong>Contract not configured.</strong> Run{' '}
          <code>npm run deploy:contract</code> and set <code>VITE_CONTRACT_ID</code>.
        </div>
      )}

      {!connected ? (
        <HeroBanner onConnect={() => connect().catch(() => {})} connecting={connecting} />
      ) : (
        <>
          <QuickActions
            publicKey={publicKey!}
            loading={loading}
            onInit={initHub}
            onRefresh={handleRefreshStats}
          />

          {(lastTxHash || EXAMPLE_TX_HASH) && (
            <p className="tx-link muted animate-in">
              Last transaction:{' '}
              <a
                href={`https://stellar.expert/explorer/testnet/tx/${lastTxHash || EXAMPLE_TX_HASH}`}
                target="_blank"
                rel="noreferrer"
              >
                {(lastTxHash || EXAMPLE_TX_HASH).slice(0, 20)}…
              </a>
            </p>
          )}

          <div className="catalog-section">
            <div className="section-header">
              <h2>Supply Catalog</h2>
              <span className="muted">{filteredItems.length} items available</span>
            </div>

            <CatalogToolbar onFilterChange={handleFilterChange} />

            {loading && !modalOpen ? (
              <div className="catalog-loading">
                <LoadingSpinner label="Updating…" />
              </div>
            ) : filteredItems.length === 0 ? (
              <div className="empty-state glass">
                <span className="empty-icon">🔍</span>
                <p>No supplies match your search</p>
                <span className="muted">Try a different category or search term</span>
              </div>
            ) : (
              <div className="catalog-grid">
                {filteredItems.map((item, i) => (
                  <SupplyCard
                    key={item.id}
                    item={item}
                    index={i}
                    onOrder={openPurchase}
                    disabled={loading || !contractConfigured}
                  />
                ))}
              </div>
            )}
          </div>
        </>
      )}

      <PurchaseModal
        item={selectedItem}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={handlePurchase}
        loading={loading}
        phase={phase}
      />
    </section>
  );
}
