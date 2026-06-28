import type { SupplyItem } from '../lib/contract';

interface SupplyCardProps {
  item: SupplyItem;
  onOrder: (item: SupplyItem) => void;
  disabled?: boolean;
  index?: number;
}

function formatXlm(stroops: number): string {
  return (stroops / 10_000_000).toFixed(2);
}

export default function SupplyCard({ item, onOrder, disabled, index = 0 }: SupplyCardProps) {
  return (
    <article
      className="catalog-card glass animate-in"
      style={{ animationDelay: `${index * 60}ms` }}
    >
      <div className="catalog-card-top">
        <div className="catalog-emoji-wrap">
          <span className="catalog-emoji">{item.emoji}</span>
        </div>
        {item.tag && <span className={`catalog-tag tag-${item.tag}`}>{item.tag}</span>}
      </div>
      <span className="catalog-category">{item.category}</span>
      <h3>{item.name}</h3>
      <p className="catalog-desc">{item.desc}</p>
      {item.stock !== undefined && (
        <span className={`catalog-stock ${item.stock < 5 ? 'low' : ''}`}>
          {item.stock > 0 ? `${item.stock} units in orbit` : 'Out of stock'}
        </span>
      )}
      <div className="catalog-footer">
        <div className="catalog-price-wrap">
          <span className="catalog-price">{formatXlm(item.price)}</span>
          <span className="catalog-price-unit">XLM</span>
        </div>
        <button
          type="button"
          className="btn btn-primary btn-sm"
          onClick={() => onOrder(item)}
          disabled={disabled || item.stock === 0}
        >
          Order →
        </button>
      </div>
    </article>
  );
}
