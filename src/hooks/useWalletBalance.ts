import { useEffect, useState, useCallback } from 'react';
import { HORIZON_URL } from '../lib/contract';

export function useWalletBalance(publicKey: string | null) {
  const [balance, setBalance] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchBalance = useCallback(async () => {
    if (!publicKey) {
      setBalance(null);
      return;
    }

    setLoading(true);
    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 8000);

      const res = await fetch(`${HORIZON_URL}/accounts/${publicKey}`, {
        signal: controller.signal,
      });
      clearTimeout(timer);

      if (!res.ok) {
        setBalance(null);
        return;
      }

      const data = await res.json();
      const native = data.balances?.find(
        (b: { asset_type: string }) => b.asset_type === 'native'
      );
      setBalance(native?.balance ?? null);
    } catch {
      setBalance(null);
    } finally {
      setLoading(false);
    }
  }, [publicKey]);

  useEffect(() => {
    fetchBalance();
    const id = setInterval(fetchBalance, 20000);
    return () => clearInterval(id);
  }, [fetchBalance]);

  return { balance, loading, refresh: fetchBalance };
}
