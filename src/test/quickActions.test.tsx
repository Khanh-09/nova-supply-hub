import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import QuickActions from '../components/QuickActions';
import { ToastProvider } from '../context/ToastContext';

const PUBLIC_KEY = 'GBORRISIORGXIIXBYHZFBZKBH3MHUVY6ZOMFXGR3TPLZ3A3KYC7Y7G2AF';

function renderQuickActions(hubInitialized: boolean | null) {
  return render(
    <ToastProvider>
      <QuickActions
        publicKey={PUBLIC_KEY}
        loading={false}
        hubInitialized={hubInitialized}
        onInit={vi.fn()}
        onRefresh={vi.fn()}
      />
    </ToastProvider>
  );
}

describe('QuickActions — Init Hub visibility', () => {
  beforeEach(() => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({ status: 200 })
    );
  });

  it('shows the actionable Init Hub button only when the hub is not yet initialized', async () => {
    renderQuickActions(false);
    expect(screen.getByRole('button', { name: /init hub/i })).toBeInTheDocument();
    await waitFor(() => screen.getByText(/funded on testnet/i));
  });

  it('hides the Init Hub button and shows a live status once initialized', async () => {
    renderQuickActions(true);
    await waitFor(() => {
      expect(screen.getByText(/hub is live/i)).toBeInTheDocument();
    });
    expect(screen.queryByRole('button', { name: /init hub/i })).not.toBeInTheDocument();
  });

  it('shows a checking state while hub status is still loading', async () => {
    renderQuickActions(null);
    expect(screen.getByText(/checking hub/i)).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /init hub/i })).not.toBeInTheDocument();
    await waitFor(() => screen.getByText(/funded on testnet/i));
  });
});
