import { useEffect, useCallback, useState } from 'react';
import type { SupplyItem } from '../lib/contract';
import type { TxPhase } from '../lib/stellarTx';
import TransactionProgress from './TransactionProgress';

interface PurchaseModalProps {
  item: SupplyItem | null;
  open: boolean;
  onClose: () => void;
  onConfirm: (quantity: number) => void;
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
  const [quantity, setQuantity] = useState(1);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !loading) onClose();
    },
    [onClose, loading]
  );

  useEffect(() => {
    if (!open) return;
    setQuantity(1);
    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [open, handleKeyDown]);

  if (!open || !item) return null;

  const unitPriceXlm = item.price / 10_000_000;
  const totalPrice = unitPriceXlm * quantity;
  const maxQty = item.stock ?? 99;

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

          <div className="quantity-selector">
            <span className="quantity-label">Quantity</span>
            <div className="quantity-controls">
              <button
                type="button"
                className="qty-btn"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                disabled={loading || quantity <= 1}
                aria-label="Decrease quantity"
              >
                −
              </button>
              <span className="qty-value">{quantity}</span>
              <button
                type="button"
                className="qty-btn"
                onClick={() => setQuantity((q) => Math.min(maxQty, q + 1))}
                disabled={loading || quantity >= maxQty}
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>
          </div>

          <div className="modal-summary">
            <div className="summary-row">
              <span>Unit price</span>
              <span>{unitPriceXlm.toFixed(2)} XLM</span>
            </div>
            <div className="summary-row">
              <span>Quantity</span>
              <span>×{quantity}</span>
            </div>
            <div className="summary-row">
              <span>Shipment ID</span>
              <span className="mono">#{item.id}</span>
            </div>
            <div className="summary-row summary-total">
              <span>Total due</span>
              <strong>{totalPrice.toFixed(2)} XLM</strong>
            </div>
          </div>

          <TransactionProgress phase={phase} active={loading} />
        </div>

        <div className="modal-actions">
          <button type="button" className="btn btn-ghost" onClick={onClose} disabled={loading}>
            Cancel
          </button>
          <button type="button" className="btn btn-primary" onClick={() => onConfirm(quantity)} disabled={loading}>
            {loading ? (
              <>
                <span className="btn-spinner" aria-hidden="true" />
                Processing…
              </>
            ) : (
              `Pay ${totalPrice.toFixed(2)} XLM`
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
