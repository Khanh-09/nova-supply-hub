import { useEffect, useState } from 'react';
import { checkAccountExists } from '../lib/account';

export function useAccountStatus(publicKey: string | null) {
  const [funded, setFunded] = useState<boolean | null>(null);
  const [checking, setChecking] = useState(false);

  useEffect(() => {
    if (!publicKey) {
      setFunded(null);
      return;
    }

    let cancelled = false;
    setChecking(true);

    (async () => {
      const exists = await checkAccountExists(publicKey);
      if (!cancelled) {
        setFunded(exists);
        setChecking(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [publicKey]);

  const refresh = async () => {
    if (!publicKey) return;
    setChecking(true);
    const exists = await checkAccountExists(publicKey);
    setFunded(exists);
    setChecking(false);
    return exists;
  };

  return { funded, checking, refresh };
}
