import { useEffect, useCallback } from 'react';
import type { SupplyItem } from '../lib/contract';
import type { TxPhase } from '../lib/stellarTx';
import TransactionProgress from './TransactionProgress';

interface PurchaseModalProps {
  item: SupplyItem | null;
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading: boolean;
  phase: TxPhase | null;
}

export default function PurchaseModal({
  item,
  open,
  onClose,
  onConfirm,
  loading,
  phase,
}: PurchaseModalProps) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !loading) onClose();
    },
    [onClose, loading]
  );

  useEffect(() => {
    if (!open) return;
    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [open, handleKeyDown]);

  if (!open || !item) return null;

  const priceXlm = (item.price / 10_000_000).toFixed(2);

  return (
    <div
      className="modal-overlay animate-fade"
      role="dialog"
      aria-modal="true"
      aria-labelledby="purchase-modal-title"
      onClick={(e) => {
        if (e.target === e.currentTarget && !loading) onClose();
      }}
    >
      <div className="modal glass animate-slide-up">
        <button
          type="button"
          className="modal-close"
          onClick={onClose}
          disabled={loading}
          aria-label="Close"
        >
          ×
        </button>

        <div className="modal-header">
          <span className="modal-emoji">{item.emoji}</span>
          <div>
            <span className="catalog-category">{item.category}</span>
            <h3 id="purchase-modal-title">Confirm Shipment</h3>
          </div>
        </div>

        <div className="modal-body">
          <p className="modal-item-name">{item.name}</p>
          <p className="modal-desc">{item.desc}</p>

          <div className="modal-summary">
            <div className="summary-row">
              <span>Unit price</span>
              <span>{priceXlm} XLM</span>
            </div>
            <div className="summary-row">
              <span>Shipment ID</span>
              <span className="mono">#{item.id}</span>
            </div>
            <div className="summary-row summary-total">
              <span>Total due</span>
              <strong>{priceXlm} XLM</strong>
            </div>
          </div>

          <TransactionProgress phase={phase} active={loading} />
        </div>

        <div className="modal-actions">
          <button type="button" className="btn btn-ghost" onClick={onClose} disabled={loading}>
            Cancel
          </button>
          <button type="button" className="btn btn-primary" onClick={onConfirm} disabled={loading}>
            {loading ? (
              <>
                <span className="btn-spinner" aria-hidden="true" />
                Processing…
              </>
            ) : (
              'Confirm & Pay'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
