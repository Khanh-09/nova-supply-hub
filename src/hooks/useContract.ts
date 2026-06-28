import { useState, useCallback, useEffect } from 'react';
import {
  initSupplyHub,
  purchaseSupply,
  getContractBalance,
  getShipmentCount,
  type TxPhase,
  type TxResult,
} from '../lib/stellarTx';
import { DEFAULT_TOKEN, isValidContractId, CONTRACT_ID } from '../lib/contract';
import { formatStellarError } from '../lib/account';
import type { SignTransactionFn } from '../lib/stellarTx';

export function useContract(publicKey: string | null, signTransaction: SignTransactionFn) {
  const [balance, setBalance] = useState(0);
  const [shipmentCount, setShipmentCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [phase, setPhase] = useState<TxPhase | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [lastTxHash, setLastTxHash] = useState<string | null>(null);

  const refreshStats = useCallback(async () => {
    if (!isValidContractId(CONTRACT_ID)) return;
    try {
      const [bal, count] = await Promise.all([getContractBalance(), getShipmentCount()]);
      setBalance(bal);
      setShipmentCount(count);
    } catch (err) {
      console.warn('Stats refresh failed:', (err as Error).message);
    }
  }, []);

  useEffect(() => {
    refreshStats();
    const id = setInterval(refreshStats, 15000);
    return () => clearInterval(id);
  }, [refreshStats]);

  const initHub = useCallback(async () => {
    if (!publicKey) throw new Error('Connect wallet first');
    setLoading(true);
    setError(null);
    setPhase(null);
    try {
      const result: TxResult = await initSupplyHub(
        publicKey,
        'Nova Supply Hub',
        publicKey,
        signTransaction,
        { onPhase: setPhase }
      );
      setLastTxHash(result.hash);
      await refreshStats();
      return result;
    } catch (err) {
      const { message } = formatStellarError(err);
      setError(message);
      throw err;
    } finally {
      setLoading(false);
      setPhase(null);
    }
  }, [publicKey, signTransaction, refreshStats]);

  const purchase = useCallback(
    async (shipmentId: number, amount: number) => {
      if (!publicKey) throw new Error('Connect wallet first');
      setLoading(true);
      setError(null);
      setPhase(null);
      try {
        const result = await purchaseSupply(
          publicKey,
          DEFAULT_TOKEN,
          amount,
          shipmentId,
          publicKey,
          signTransaction,
          { onPhase: setPhase }
        );
        setLastTxHash(result.hash);
        await refreshStats();
        return result;
      } catch (err) {
        const { message } = formatStellarError(err);
        setError(message);
        throw err;
      } finally {
        setLoading(false);
        setPhase(null);
      }
    },
    [publicKey, signTransaction, refreshStats]
  );

  return {
    balance,
    shipmentCount,
    loading,
    phase,
    error,
    lastTxHash,
    refreshStats,
    initHub,
    purchase,
    contractConfigured: isValidContractId(CONTRACT_ID),
  };
}
