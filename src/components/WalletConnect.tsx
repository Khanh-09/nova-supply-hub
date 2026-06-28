import { useWalletContext } from '../context/WalletContext';
import CopyButton from './CopyButton';

function truncateKey(key: string | null) {
  if (!key) return '';
  return `${key.slice(0, 4)}…${key.slice(-4)}`;
}

export default function WalletConnect() {
  const { publicKey, connecting, error, connected, connect, disconnect } = useWalletContext();

  return (
    <header className="wallet-bar glass">
      <div className="brand">
        <div className="brand-logo" aria-hidden="true">
          <span className="brand-icon">🛰️</span>
          <span className="brand-orbit" />
        </div>
        <div>
          <h1>Nova Supply Hub</h1>
          <p>Orbital logistics · Stellar Soroban</p>
        </div>
      </div>

      <div className="wallet-actions">
        <span className="network-badge">
          <span className="network-dot" />
          Testnet
        </span>

        {error && (
          <p className="wallet-error" role="alert">
            {error}
          </p>
        )}

        {connected ? (
          <div className="wallet-connected">
            <span className="wallet-badge" title={publicKey || ''}>
              <span className="wallet-dot" />
              {truncateKey(publicKey)}
            </span>
            <CopyButton text={publicKey || ''} label="address" className="btn-ghost-inline" />
            <button type="button" className="btn btn-ghost btn-sm" onClick={disconnect}>
              Disconnect
            </button>
          </div>
        ) : (
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => connect().catch(() => {})}
            disabled={connecting}
          >
            {connecting ? (
              <>
                <span className="btn-spinner" aria-hidden="true" />
                Connecting…
              </>
            ) : (
              'Connect Wallet'
            )}
          </button>
        )}
      </div>
    </header>
  );
}
