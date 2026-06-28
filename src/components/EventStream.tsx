import type { ContractEvent } from '../lib/stellarTx';
import LoadingSpinner from './LoadingSpinner';

function formatEventType(topics: unknown[]): { label: string; icon: string } {
  const raw = topics
    .map((t) => {
      if (typeof t === 'string') return t;
      if (Array.isArray(t)) return t.join('');
      return '';
    })
    .join('')
    .toLowerCase();

  if (raw.includes('init')) return { label: 'Hub Initialized', icon: '🚀' };
  if (raw.includes('buy') || raw.includes('purchase')) return { label: 'Shipment Purchased', icon: '📦' };
  return { label: 'Contract Event', icon: '📡' };
}

function formatValue(value: unknown): string | null {
  if (value == null) return null;
  if (Array.isArray(value)) {
    const [amount, id] = value;
    const parts: string[] = [];
    if (amount != null) parts.push(`Amount: ${Number(amount) / 10_000_000} XLM`);
    if (id != null) parts.push(`Shipment #${id}`);
    return parts.join(' · ') || JSON.stringify(value);
  }
  return JSON.stringify(value);
}

export interface EventStreamProps {
  events: ContractEvent[];
  loading: boolean;
  error: string | null;
  refresh: () => void;
}

export default function EventStream({ events, loading, error, refresh }: EventStreamProps) {
  return (
    <section className="panel glass event-stream animate-in">
      <div className="panel-header">
        <div className="panel-title-wrap">
          <h2>Live Activity</h2>
          <span className="live-indicator">
            <span className="live-pulse" />
            Live
          </span>
        </div>
        <button type="button" className="btn btn-ghost btn-sm" onClick={refresh} disabled={loading}>
          {loading ? 'Syncing…' : '↻ Refresh'}
        </button>
      </div>

      {error && <p className="panel-error">{error}</p>}

      <div className="event-list">
        {loading && events.length === 0 ? (
          <div className="event-skeleton">
            <LoadingSpinner size="sm" label="Scanning ledger…" />
          </div>
        ) : events.length === 0 ? (
          <div className="empty-state">
            <span className="empty-icon">📡</span>
            <p>No events yet</p>
            <span className="muted">Initialize the hub or make a purchase to see on-chain activity</span>
          </div>
        ) : (
          events.map((evt, i) => {
            const { label, icon } = formatEventType(evt.topics);
            const valueStr = formatValue(evt.value);
            return (
              <article
                key={evt.id}
                className="event-card animate-in"
                style={{ animationDelay: `${i * 40}ms` }}
              >
                <div className="event-card-header">
                  <span className="event-icon">{icon}</span>
                  <div>
                    <span className="event-type">{label}</span>
                    <span className="event-ledger">Ledger {evt.ledger}</span>
                  </div>
                </div>
                {valueStr && <p className="event-value-text">{valueStr}</p>}
                {evt.txHash && (
                  <a
                    className="event-tx"
                    href={`https://stellar.expert/explorer/testnet/tx/${evt.txHash}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    View on Stellar Expert →
                  </a>
                )}
              </article>
            );
          })
        )}
      </div>
    </section>
  );
}
