import { useState, useCallback, useEffect } from 'react';
import {
  isConnected,
  isAllowed,
  setAllowed,
  getAddress,
  requestAccess,
  getNetworkDetails,
  signTransaction as freighterSignTransaction,
} from '@stellar/freighter-api';
import { NETWORK_PASSPHRASE } from '../lib/contract';
import type { SignTransactionFn } from '../lib/stellarTx';

function freighterError(result: { error?: { message?: string } } | null | undefined, fallback: string) {
  if (result?.error) {
    throw new Error(result.error.message || fallback);
  }
}

function isTestnetNetwork(details: { network?: string; networkPassphrase?: string } | null | undefined) {
  if (!details) return false;
  const network = (details.network || '').toUpperCase();
  const passphrase = details.networkPassphrase || '';
  return (
    network.includes('TEST') ||
    passphrase.includes('Test SDF') ||
    passphrase === NETWORK_PASSPHRASE
  );
}

async function safeFreighterCheck<T>(fn: (...args: unknown[]) => Promise<T>, ...args: unknown[]): Promise<T | null> {
  try {
    return await fn(...args);
  } catch (err) {
    const msg = (err as Error)?.message || '';
    if (
      msg.includes('Could not establish connection') ||
      msg.includes('message channel closed') ||
      msg.includes('Unable to send message') ||
      msg.includes('Receiving end does not exist')
    ) {
      return null;
    }
    throw err;
  }
}

export function useWallet() {
  const [publicKey, setPublicKey] = useState<string | null>(null);
  const [connecting, setConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const connection = await safeFreighterCheck(isConnected);
        if (!connection || !(connection as { isConnected?: boolean }).isConnected || cancelled) return;

        const allowedResult = await safeFreighterCheck(isAllowed);
        if (!allowedResult || !(allowedResult as { isAllowed?: boolean }).isAllowed || cancelled) return;

        const addressResult = await safeFreighterCheck(getAddress);
        const address = (addressResult as { address?: string } | null)?.address;
        if (address && !cancelled) {
          setPublicKey(address);
        }
      } catch {
        // Freighter not ready — user can connect manually
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const connect = useCallback(async () => {
    setConnecting(true);
    setError(null);
    try {
      const connection = await safeFreighterCheck(isConnected);
      if (!connection || !(connection as { isConnected?: boolean }).isConnected) {
        throw new Error(
          'Freighter wallet not found. Install it from https://freighter.app and refresh.'
        );
      }

      const allowedResult = await safeFreighterCheck(isAllowed);
      if (!allowedResult || !(allowedResult as { isAllowed?: boolean }).isAllowed) {
        const allow = await safeFreighterCheck(setAllowed);
        freighterError(allow as { error?: { message?: string } }, 'Freighter access was not granted.');
      }

      let addressResult = await safeFreighterCheck(getAddress);
      if (!(addressResult as { address?: string } | null)?.address) {
        addressResult = await safeFreighterCheck(requestAccess);
      }

      freighterError(addressResult as { error?: { message?: string } }, 'Wallet connection was cancelled.');
      const address = (addressResult as { address?: string }).address;
      if (!address) {
        throw new Error('Wallet connection was cancelled or no address returned.');
      }

      setPublicKey(address);
      return address;
    } catch (err) {
      const msg = (err as Error)?.message || 'Failed to connect wallet';
      setError(msg);
      throw err;
    } finally {
      setConnecting(false);
    }
  }, []);

  const disconnect = useCallback(() => {
    setPublicKey(null);
    setError(null);
  }, []);

  const prepareForSigning = useCallback(async (address: string) => {
    const connection = await isConnected();
    freighterError(connection, 'Freighter is not installed or not reachable.');
    if (!connection.isConnected) {
      throw new Error('Freighter is not connected. Refresh the page and try again.');
    }

    const allowedResult = await isAllowed();
    if (!allowedResult?.isAllowed) {
      const allow = await setAllowed();
      freighterError(allow, 'Allow this site in Freighter to sign transactions.');
      if (!allow?.isAllowed) {
        throw new Error('Allow this site in Freighter to sign transactions.');
      }
    }

    const network = await getNetworkDetails();
    freighterError(network, 'Could not read Freighter network settings.');
    if (!isTestnetNetwork(network)) {
      throw new Error(
        'Freighter must be on Testnet. Open Freighter → Settings → Network → Testnet, then retry.'
      );
    }

    let current = await getAddress();
    if (!current?.address) {
      current = await requestAccess();
    }
    freighterError(current, 'Could not read Freighter account.');
    if (current.address !== address) {
      throw new Error(
        `Freighter active account (${current.address.slice(0, 8)}…) does not match connected wallet. Switch account in Freighter.`
      );
    }
  }, []);

  const signTransaction: SignTransactionFn = useCallback(
    async (xdr, opts = {} as { networkPassphrase?: string; address?: string }) => {
      const address = opts.address;
      if (!address) {
        throw new Error('No wallet address provided for signing.');
      }

      await prepareForSigning(address);

      let result;
      try {
        result = await freighterSignTransaction(xdr, {
          networkPassphrase: opts.networkPassphrase || NETWORK_PASSPHRASE,
          address,
        });
      } catch (err) {
        const msg = (err as Error)?.message || '';
        if (msg.includes('User declined') || msg.includes('rejected')) {
          throw new Error('Transaction rejected in Freighter.');
        }
        throw err;
      }

      freighterError(result, 'Transaction signing failed in Freighter.');
      if (!result?.signedTxXdr) {
        throw new Error('Transaction signing was cancelled in Freighter.');
      }

      return result.signedTxXdr;
    },
    [prepareForSigning]
  );

  return {
    publicKey,
    connecting,
    error,
    connected: !!publicKey,
    connect,
    disconnect,
    signTransaction,
    prepareForSigning,
  };
}
