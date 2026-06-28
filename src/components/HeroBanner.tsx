interface HeroBannerProps {
  onConnect: () => void;
  connecting: boolean;
}

const STEPS = [
  { num: '01', title: 'Connect Freighter', desc: 'Link your Stellar testnet wallet securely' },
  { num: '02', title: 'Fund & Initialize', desc: 'Get free XLM via Friendbot, init the hub once' },
  { num: '03', title: 'Order Supplies', desc: 'Pay on-chain via Soroban smart contract' },
];

export default function HeroBanner({ onConnect, connecting }: HeroBannerProps) {
  return (
    <section className="hero glass animate-in">
      <div className="hero-content">
        <span className="hero-badge">Stellar Soroban · Testnet</span>
        <h2 className="hero-title">
          Orbital supply chain,
          <br />
          <span className="hero-gradient">powered by smart contracts</span>
        </h2>
        <p className="hero-desc">
          Procure fuel cells, solar arrays, and life-support modules for your station.
          Every shipment is recorded on-chain with real-time event streaming.
        </p>
        <div className="hero-actions">
          <button
            type="button"
            className="btn btn-primary btn-lg"
            onClick={onConnect}
            disabled={connecting}
          >
            {connecting ? (
              <>
                <span className="btn-spinner" aria-hidden="true" />
                Connecting…
              </>
            ) : (
              <>🔗 Connect Freighter Wallet</>
            )}
          </button>
          <a
            className="btn btn-ghost btn-lg"
            href="https://freighter.app"
            target="_blank"
            rel="noreferrer"
          >
            Get Freighter
          </a>
        </div>
      </div>

      <div className="hero-steps">
        {STEPS.map((step) => (
          <article key={step.num} className="hero-step">
            <span className="hero-step-num">{step.num}</span>
            <div>
              <h3>{step.title}</h3>
              <p>{step.desc}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
