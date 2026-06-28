export type MobileTab = 'shop' | 'activity' | 'account';

interface MobileNavProps {
  active: MobileTab;
  onChange: (tab: MobileTab) => void;
  eventCount: number;
}

export default function MobileNav({ active, onChange, eventCount }: MobileNavProps) {
  const tabs: { id: MobileTab; label: string; icon: string }[] = [
    { id: 'shop', label: 'Shop', icon: '🛒' },
    { id: 'activity', label: 'Activity', icon: '📡' },
    { id: 'account', label: 'Account', icon: '👤' },
  ];

  return (
    <nav className="mobile-nav" aria-label="Mobile navigation">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          className={`mobile-nav-item ${active === tab.id ? 'active' : ''}`}
          onClick={() => onChange(tab.id)}
          aria-current={active === tab.id ? 'page' : undefined}
        >
          <span className="mobile-nav-icon">{tab.icon}</span>
          <span className="mobile-nav-label">{tab.label}</span>
          {tab.id === 'activity' && eventCount > 0 && (
            <span className="mobile-nav-badge">{eventCount > 9 ? '9+' : eventCount}</span>
          )}
        </button>
      ))}
    </nav>
  );
}
