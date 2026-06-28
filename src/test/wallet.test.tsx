import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import WalletConnect from '../components/WalletConnect';
import { WalletProvider } from '../context/WalletContext';

const freighterMock = vi.hoisted(() => ({
  isConnected: vi.fn(),
  isAllowed: vi.fn(),
  getAddress: vi.fn(),
  setAllowed: vi.fn(),
  requestAccess: vi.fn(),
  getNetworkDetails: vi.fn(),
  signTransaction: vi.fn(),
}));

vi.mock('@stellar/freighter-api', () => freighterMock);

function renderWallet() {
  return render(
    <WalletProvider>
      <WalletConnect />
    </WalletProvider>
  );
}

describe('Connect Wallet feature', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    freighterMock.isConnected.mockResolvedValue({ isConnected: false });
    freighterMock.isAllowed.mockResolvedValue({ isAllowed: false });
    freighterMock.getAddress.mockResolvedValue({ address: null });
  });

  it('renders Connect Wallet button when disconnected', () => {
    renderWallet();
    expect(screen.getByRole('button', { name: /connect wallet/i })).toBeInTheDocument();
  });

  it('connects wallet and shows truncated public key', async () => {
    const testAddress = 'GBORRISIORGXIIXBYHZFBZKBH3MHUVY6ZOMFXGR3TPLZ3A3KYC7Y7G2AF';
    freighterMock.isConnected.mockResolvedValue({ isConnected: true });
    freighterMock.isAllowed.mockResolvedValue({ isAllowed: true });
    freighterMock.getAddress.mockResolvedValue({ address: testAddress });

    renderWallet();
    fireEvent.click(screen.getByRole('button', { name: /connect wallet/i }));

    await waitFor(() => {
      expect(screen.getByText(/GBOR…G2AF/)).toBeInTheDocument();
    });
    expect(screen.getByRole('button', { name: /disconnect/i })).toBeInTheDocument();
  });

  it('shows error when Freighter is not installed', async () => {
    freighterMock.isConnected.mockResolvedValue({ isConnected: false });

    renderWallet();
    fireEvent.click(screen.getByRole('button', { name: /connect wallet/i }));

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent(/freighter wallet not found/i);
    });
  });
});
