interface DashboardStatsProps {
  balance: number;
  shipmentCount: number;
  contractConfigured: boolean;
  contractId: string;
  loading?: boolean;
}

function formatXlm(stroops: number): string {
  return (stroops / 10_000_000).toFixed(2);
}

export default function DashboardStats({
  balance,
  shipmentCount,
  contractConfigured,
  contractId,
  loading,
}: DashboardStatsProps) {
  return (
    <div className="stats-row">
      <article className="stat-card glass animate-in" style={{ animationDelay: '0ms' }}>
        <div className="stat-icon" aria-hidden="true">💰</div>
        <span className="stat-label">Treasury Balance</span>
        <span className={`stat-value ${loading ? 'shimmer' : ''}`}>
          {formatXlm(balance)} <small>XLM</small>
        </span>
      </article>
      <article className="stat-card glass animate-in" style={{ animationDelay: '80ms' }}>
        <div className="stat-icon" aria-hidden="true">📦</div>
        <span className="stat-label">Total Shipments</span>
        <span className={`stat-value ${loading ? 'shimmer' : ''}`}>{shipmentCount}</span>
      </article>
      <article className="stat-card glass animate-in" style={{ animationDelay: '160ms' }}>
        <div className="stat-icon" aria-hidden="true">⛓️</div>
        <span className="stat-label">Smart Contract</span>
        <span
          className={`stat-value stat-mono ${contractConfigured ? 'stat-live' : 'stat-offline'}`}
          title={contractId || 'Not configured'}
        >
          {contractConfigured ? `${contractId.slice(0, 8)}…` : 'Not deployed'}
        </span>
        {contractConfigured && <span className="stat-badge-live">Live</span>}
      </article>
    </div>
  );
}
