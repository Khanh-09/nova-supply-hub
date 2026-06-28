import { Component, useState, type ReactNode, type ErrorInfo } from 'react';
import { WalletProvider } from './context/WalletContext';
import { ToastProvider } from './context/ToastContext';
import WalletConnect from './components/WalletConnect';
import SupplyPanel from './components/SupplyPanel';
import EventStream from './components/EventStream';
import Starfield from './components/Starfield';
import MobileNav, { type MobileTab } from './components/MobileNav';
import { useEventStream } from './hooks/useEventStream';

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<{ children: ReactNode }, ErrorBoundaryState> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('App crash:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary glass">
          <span className="empty-icon">⚠️</span>
          <h2>Something went wrong</h2>
          <p>{this.state.error?.message}</p>
          <button type="button" className="btn btn-primary" onClick={() => window.location.reload()}>
            Reload App
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

function AppContent() {
  const [mobileTab, setMobileTab] = useState<MobileTab>('shop');
  const eventStream = useEventStream(true);

  return (
    <div className="app">
      <Starfield />
      <div className="bg-gradient" aria-hidden="true" />
      <WalletConnect />

      <main className="main-grid">
        <div className={`main-panel ${mobileTab !== 'shop' ? 'mobile-hidden' : ''}`}>
          <SupplyPanel />
        </div>
        <div className={`side-panel ${mobileTab !== 'activity' ? 'mobile-hidden' : ''}`}>
          <EventStream {...eventStream} />
        </div>
        <div className={`account-panel mobile-only ${mobileTab !== 'account' ? 'mobile-hidden' : ''}`}>
          <section className="panel glass animate-in">
            <h2>Quick Help</h2>
            <ul className="help-list">
              <li>Install <a href="https://freighter.app" target="_blank" rel="noreferrer">Freighter</a> wallet</li>
              <li>Switch Freighter to <strong>Testnet</strong></li>
              <li>Connect wallet → Fund account → Init hub</li>
              <li>Browse catalog and order supplies</li>
              <li>Watch live events in Activity tab</li>
            </ul>
          </section>
        </div>
      </main>

      <MobileNav active={mobileTab} onChange={setMobileTab} eventCount={eventStream.events.length} />

      <footer className="app-footer desktop-only">
        <p>Nova Supply Hub · Stellar Soroban Testnet · Level 3 Orange Belt</p>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <ToastProvider>
        <WalletProvider>
          <AppContent />
        </WalletProvider>
      </ToastProvider>
    </ErrorBoundary>
  );
}
