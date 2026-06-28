import type { TxPhase } from '../lib/stellarTx';

const STEPS: { phase: TxPhase; label: string }[] = [
  { phase: 'loading-account', label: 'Load account' },
  { phase: 'simulating', label: 'Simulate' },
  { phase: 'preparing', label: 'Prepare tx' },
  { phase: 'awaiting-signature', label: 'Sign in Freighter' },
  { phase: 'submitting', label: 'Submit' },
  { phase: 'confirming', label: 'Confirm on-chain' },
];

interface TransactionProgressProps {
  phase: TxPhase | null;
  active: boolean;
}

export default function TransactionProgress({ phase, active }: TransactionProgressProps) {
  if (!active || !phase) return null;

  const currentIndex = STEPS.findIndex((s) => s.phase === phase);

  return (
    <div className="tx-progress" aria-label="Transaction progress">
      {STEPS.map((step, i) => {
        const done = i < currentIndex;
        const current = i === currentIndex;
        return (
          <div
            key={step.phase}
            className={`tx-step ${done ? 'done' : ''} ${current ? 'current' : ''}`}
          >
            <span className="tx-step-dot">{done ? '✓' : i + 1}</span>
            <span className="tx-step-label">{step.label}</span>
          </div>
        );
      })}
    </div>
  );
}
