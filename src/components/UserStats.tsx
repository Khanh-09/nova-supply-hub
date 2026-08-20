import type { ContractEvent } from '../lib/stellarTx';

interface UserStatsProps {
  events: ContractEvent[];
  publicKey: string | null;
}

export default function UserStats({ events, publicKey }: UserStatsProps) {
  if (!publicKey) {
    return (
      <section className="panel glass animate-in">
        <h2>Your Activity</h2>
        <div className="empty-state">
          <span className="empty-icon">👤</span>
          <p>Connect wallet to see stats</p>
          <span className="muted">Your personal purchase history will appear here</span>
        </div>
      </section>
    );
  }

  // Filter events for the connected wallet (check topics for wallet address)
  const myEvents = events.filter((evt) => {
    const topicStr = evt.topics
      .map((t) => (typeof t === 'string' ? t : JSON.stringify(t)))
      .join(' ');
    return topicStr.includes(publicKey) || topicStr.includes(publicKey.slice(0, 10));
  });

  const purchaseEvents = myEvents.filter((evt) => {
    const topicStr = evt.topics.map((t) => String(t)).join('').toLowerCase();
    return topicStr.includes('buy') || topicStr.includes('purchase');
  });

  // Calculate total spent from purchase events
  const totalSpent = purchaseEvents.reduce((sum, evt) => {
    if (Array.isArray(evt.value) && evt.value[0] != null) {
      return sum + Number(evt.value[0]) / 10_000_000;
    }
    return sum;
  }, 0);

  return (
    <section className="panel glass animate-in user-stats-panel">
      <div className="panel-header">
        <div className="panel-title-wrap">
          <h2>Your Activity</h2>
        </div>
      </div>

      <div className="user-stats-grid">
        <div className="user-stat-card">
          <span className="user-stat-icon">📦</span>
          <span className="user-stat-value">{purchaseEvents.length}</span>
          <span className="user-stat-label">Purchases</span>
        </div>
        <div className="user-stat-card">
          <span className="user-stat-icon">💰</span>
          <span className="user-stat-value">{totalSpent.toFixed(2)}</span>
          <span className="user-stat-label">XLM Spent</span>
        </div>
        <div className="user-stat-card">
          <span className="user-stat-icon">⚡</span>
          <span className="user-stat-value">{myEvents.length}</span>
          <span className="user-stat-label">Total Events</span>
        </div>
      </div>

      {purchaseEvents.length > 0 ? (
        <div className="user-purchases-list">
          <h4 className="user-purchases-title">Recent Purchases</h4>
          {purchaseEvents.slice(0, 5).map((evt) => {
            const amount = Array.isArray(evt.value) && evt.value[0] != null
              ? (Number(evt.value[0]) / 10_000_000).toFixed(2)
              : '—';
            const shipmentId = Array.isArray(evt.value) && evt.value[1] != null
              ? `#${evt.value[1]}`
              : '';
            return (
              <div key={evt.id} className="user-purchase-row">
                <div className="user-purchase-info">
                  <span className="user-purchase-id">Shipment {shipmentId}</span>
                  <span className="user-purchase-ledger">Ledger {evt.ledger}</span>
                </div>
                <span className="user-purchase-amount">{amount} XLM</span>
                {evt.txHash && (
                  <a
                    className="user-purchase-link"
                    href={`https://stellar.expert/explorer/testnet/tx/${evt.txHash}`}
                    target="_blank"
                    rel="noreferrer"
                    title="View on Stellar Expert"
                  >
                    ↗
                  </a>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="empty-state">
          <span className="empty-icon">🛒</span>
          <p>No purchases yet</p>
          <span className="muted">Order a supply item to see your history here</span>
        </div>
      )}
    </section>
  );
}
