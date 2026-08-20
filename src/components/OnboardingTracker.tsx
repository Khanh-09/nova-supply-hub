import { useMemo } from 'react';

interface OnboardingTrackerProps {
  walletConnected: boolean;
  accountFunded: boolean | null;
  hubInitialized: boolean | null;
  hasPurchased: boolean;
}

const STEPS = [
  { id: 'connect', label: 'Connect Wallet', icon: '🔗', desc: 'Link your Freighter wallet' },
  { id: 'fund', label: 'Fund Account', icon: '💧', desc: 'Get free testnet XLM' },
  { id: 'hub', label: 'Hub Ready', icon: '🚀', desc: 'Contract is initialized' },
  { id: 'purchase', label: 'First Purchase', icon: '📦', desc: 'Order a supply item' },
];

export default function OnboardingTracker({
  walletConnected,
  accountFunded,
  hubInitialized,
  hasPurchased,
}: OnboardingTrackerProps) {
  const completedSteps = useMemo(() => {
    const done: string[] = [];
    if (walletConnected) done.push('connect');
    if (accountFunded === true) done.push('fund');
    if (hubInitialized === true) done.push('hub');
    if (hasPurchased) done.push('purchase');
    return done;
  }, [walletConnected, accountFunded, hubInitialized, hasPurchased]);

  const allDone = completedSteps.length === STEPS.length;
  const progress = (completedSteps.length / STEPS.length) * 100;

  // Don't show tracker if user has completed everything
  if (allDone) return null;

  return (
    <div className="onboarding-tracker glass animate-in">
      <div className="onboarding-header">
        <div className="onboarding-title-row">
          <span className="onboarding-icon">🗺️</span>
          <h3 className="onboarding-title">Getting Started</h3>
        </div>
        <span className="onboarding-progress-text">
          {completedSteps.length}/{STEPS.length} complete
        </span>
      </div>

      <div className="onboarding-bar">
        <div
          className="onboarding-bar-fill"
          style={{ width: `${progress}%` }}
          role="progressbar"
          aria-valuenow={completedSteps.length}
          aria-valuemin={0}
          aria-valuemax={STEPS.length}
        />
      </div>

      <div className="onboarding-steps">
        {STEPS.map((step, i) => {
          const done = completedSteps.includes(step.id);
          const isCurrent =
            !done && (i === 0 || completedSteps.includes(STEPS[i - 1].id));
          return (
            <div
              key={step.id}
              className={`onboarding-step ${done ? 'step-done' : ''} ${isCurrent ? 'step-current' : ''}`}
            >
              <span className="onboarding-step-icon">
                {done ? '✓' : step.icon}
              </span>
              <div className="onboarding-step-text">
                <span className="onboarding-step-label">{step.label}</span>
                <span className="onboarding-step-desc">{step.desc}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
