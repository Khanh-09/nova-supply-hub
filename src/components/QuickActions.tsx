import { useState } from 'react';
import LoadingSpinner from './LoadingSpinner';
import CopyButton from './CopyButton';
import { friendbotUrl, fundTestnetAccount } from '../lib/account';
import { useToast } from '../context/ToastContext';
import { useAccountStatus } from '../hooks/useAccountStatus';
import { useWalletBalance } from '../hooks/useWalletBalance';

interface QuickActionsProps {
  publicKey: string;
  loading: boolean;
  hubInitialized: boolean | null;
  onInit: () => Promise<unknown>;
  onRefresh: () => void;
}

export default function QuickActions({
  publicKey,
  loading,
  hubInitialized,
  onInit,
  onRefresh,
}: QuickActionsProps) {
  const { showToast } = useToast();
  const { funded, checking, refresh } = useAccountStatus(publicKey);
  const { balance: xlmBalance, loading: balanceLoading, refresh: refreshBalance } = useWalletBalance(publicKey);
  const [funding, setFunding] = useState(false);

  const handleFund = async () => {
    setFunding(true);
    try {
      const hash = await fundTestnetAccount(publicKey);
      showToast({
        type: 'success',
        title: 'Account funded!',
        message: 'Wait 5–10 seconds before purchasing.',
      });
      setTimeout(() => { refresh(); refreshBalance(); }, 3000);
      if (hash) {
        showToast({
          type: 'info',
          title: 'Friendbot tx',
          message: `${hash.slice(0, 16)}…`,
          duration: 4000,
        });
      }
    } catch (err) {
      showToast({
        type: 'error',
        title: 'Funding failed',
        message: (err as Error).message,
      });
    } finally {
      setFunding(false);
    }
  };

  const handleInit = async () => {
    try {
      await onInit();
      showToast({ type: 'success', title: 'Supply hub initialized on-chain' });
    } catch {
      // error handled in hook
    }
  };

  return (
    <div className="quick-actions glass animate-in">
      <div className="quick-actions-header">
        <div className="wallet-status-row">
          <span className="wallet-status-label">Account</span>
          <code className="wallet-address" title={publicKey}>
            {publicKey.slice(0, 12)}…{publicKey.slice(-8)}
          </code>
          <CopyButton text={publicKey} label="wallet address" />
        </div>
        <div className="account-status-row">
          {checking ? (
            <LoadingSpinner size="sm" />
          ) : (
            <span className={`status-pill ${funded ? 'status-funded' : 'status-unfunded'}`}>
              <span className="status-dot" />
              {funded ? 'Funded on Testnet' : 'Needs funding'}
            </span>
          )}
          {xlmBalance !== null && (
            <span className={`wallet-balance-badge ${balanceLoading ? 'shimmer' : ''}`}>
              💎 {parseFloat(xlmBalance).toFixed(2)} XLM
            </span>
          )}
        </div>
      </div>

      <div className="quick-actions-grid">
        <button type="button" className="action-tile" onClick={handleFund} disabled={funding || funded === true}>
          <span className="action-icon">💧</span>
          <span className="action-title">
            {funding ? 'Funding…' : funded === true ? 'Already funded' : 'Fund Account'}
          </span>
          <span className="action-desc">Free testnet XLM via Friendbot</span>
        </button>
        {hubInitialized === false ? (
          <button type="button" className="action-tile" onClick={handleInit} disabled={loading}>
            <span className="action-icon">🚀</span>
            <span className="action-title">Init Hub</span>
            <span className="action-desc">One-time contract setup</span>
          </button>
        ) : (
          <div className="action-tile action-tile-done" aria-disabled="true">
            <span className="action-icon">{hubInitialized === null ? '⏳' : '✅'}</span>
            <span className="action-title">
              {hubInitialized === null ? 'Checking hub…' : 'Hub is live'}
            </span>
            <span className="action-desc">
              {hubInitialized === null
                ? 'Reading contract state'
                : 'Already initialized — go straight to ordering'}
            </span>
          </div>
        )}
        <a className="action-tile" href={friendbotUrl(publicKey)} target="_blank" rel="noreferrer">
          <span className="action-icon">🤖</span>
          <span className="action-title">Friendbot</span>
          <span className="action-desc">Open in new tab</span>
        </a>
        <button
          type="button"
          className="action-tile"
          onClick={() => {
            onRefresh();
            refresh();
            refreshBalance();
          }}
        >
          <span className="action-icon">🔄</span>
          <span className="action-title">Refresh</span>
          <span className="action-desc">Update balances & status</span>
        </button>
      </div>
    </div>
  );
}

