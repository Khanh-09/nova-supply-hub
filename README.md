# 🛰️ Nova Supply Hub — Orbital Logistics dApp (Soroban)

[![CI/CD Pipeline](https://github.com/Khanh-09/nova-supply-hub/actions/workflows/ci.yml/badge.svg)](https://github.com/Khanh-09/nova-supply-hub/actions/workflows/ci.yml)
[![License: Apache-2.0](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)

**Nova Supply Hub** is a production-ready Stellar Soroban dApp for orbital logistics procurement. Users connect a Freighter wallet, order space supplies (fuel cells, solar panels, docking hardware), and pay in testnet XLM via cross-contract calls to the Stellar Asset Contract (SAC).

Unlike a generic demo, this project ships a full stack: Rust smart contract, TypeScript integration layer (`contract.ts`, `stellarTx.ts`), React hooks, event streaming, automated CI/CD deployment, and comprehensive tests.

---

## 🚀 Deployment Information

| Field | Value |
|-------|-------|
| **Contract ID** | `CBEPQQWNA4OU3JEAGXOBSCQNHIXPJPV2ZIXYJTQJOBTTD5AQSMFX5CDT` |
| **Network** | Stellar Testnet (Protocol 22) |
| **Payment Token** | Native XLM via SAC |
| **Token Contract** | `CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC` |
| **Live Demo** | https://nova-supply-hub.vercel.app |
| **Example Tx Hash** | `bc25446015cbd314d8c3adfdab751f15782676542bbf8a62385116d778ce3d89` |

> **Important for reviewers:** The Contract ID is a 56-character address starting with `C`. After running `npm run deploy:contract`, it is written to both `.env` and `deployment.json`. CI also auto-deploys on push to `main`/`master` and uploads `deployment.json` as an artifact.

---

## 📁 Project Architecture

```
nova-supply-hub/
├── contracts/supply-hub/          # Soroban smart contract (Rust)
│   └── src/
│       ├── lib.rs                 # SupplyHubContract
│       └── test.rs                # 5 unit tests
├── src/
│   ├── lib/
│   │   ├── contract.ts            # Config + function name mapping
│   │   ├── stellarTx.ts           # RPC invoke, simulate, events
│   │   └── account.ts             # Friendbot, error formatting
│   ├── hooks/
│   │   ├── useWallet.ts           # Freighter connect/disconnect/sign
│   │   ├── useContract.ts         # init + purchase wrappers
│   │   └── useEventStream.ts      # Real-time getEvents polling
│   └── components/
│       ├── WalletConnect.tsx      # Connect Wallet UI
│       ├── SupplyPanel.tsx        # Catalog + purchase flow
│       └── EventStream.tsx        # Live dashboard
├── scripts/
│   ├── deploy-contract.mjs        # WASM → upload → create → init
│   └── verify-integration.mjs     # CI cross-check Rust ↔ frontend
└── .github/workflows/ci.yml       # Tests + automated deploy
```

---

## 🛠 Technical Features (Level 4 Checklist)

| # | Requirement | Implementation |
|---|-------------|----------------|
| 1 | Advanced smart contract | `SupplyHubContract` — storage, owner auth, SAC payment |
| 2 | Inter-contract communication | `token::Client::transfer` cross-call to SAC |
| 3 | Event streaming | Soroban RPC `getEvents` → `useEventStream` hook |
| 4 | CI/CD pipeline | GitHub Actions: tests, lint, integration check |
| 5 | Deployment workflow | `deploy-contract.mjs` + **automated CI deploy job** |
| 6 | Mobile responsive UI | CSS Grid/Flexbox, glassmorphism, `@media` breakpoints |
| 7 | Loading states & error handling | `TransactionProgress`, `ErrorBoundary`, `Toast`, Friendbot retry, XDR fallback |
| 8 | Tests | 5 Rust tests + 11 Vitest tests (16 total) |
| 9 | Production architecture | Separated `contract.ts` / `stellarTx.ts` / hooks |
| 10 | Monitoring & analytics | Vercel Analytics + Speed Insights, custom wallet/purchase events |
| 11 | User feedback collection | In-app `FeedbackWidget` → Formspree |
| 12 | Documentation | This README + deployment record |

---

## 🔗 Contract ↔ Frontend Function Mapping

| Rust (`SupplyHubContract`) | `contract.ts` constant | `stellarTx.ts` wrapper |
|----------------------------|------------------------|------------------------|
| `init(owner, name)` | `CONTRACT_FUNCTIONS.INIT` | `initSupplyHub()` |
| `purchase(customer, token, amount, shipment_id)` | `CONTRACT_FUNCTIONS.PURCHASE` | `purchaseSupply()` |
| `get_balance()` | `CONTRACT_FUNCTIONS.GET_BALANCE` | `getContractBalance()` |
| `get_shipment_count()` | `CONTRACT_FUNCTIONS.GET_SHIPMENT_COUNT` | `getShipmentCount()` |
| `get_owner()` | `CONTRACT_FUNCTIONS.GET_OWNER` | via `simulateContractCall` |
| `get_name()` | `CONTRACT_FUNCTIONS.GET_NAME` | via `simulateContractCall` |

Run `node scripts/verify-integration.mjs` locally or in CI to validate alignment.

---

## 📦 Setup & Run

### 1. Install dependencies

```powershell
npm install
```

### 2. Build smart contract

```powershell
$env:RUSTFLAGS="-C target-feature=-reference-types -C target-cpu=mvp"
cargo build --target wasm32v1-none --release --package supply-hub-contract
```

### 3. Run contract tests

```powershell
cargo test --package supply-hub-contract
```

### 4. Deploy contract to testnet

```powershell
npm run deploy:contract
```

This automatically: uploads WASM → creates contract → calls `init` → writes **Contract ID** to `.env` and `deployment.json`.

### 5. Start frontend

```powershell
npm run dev
```

### 6. Run frontend tests

```powershell
npm test
```

### 7. (Optional) Configure feedback collection

Create a free form at [Formspree](https://formspree.io), copy its endpoint URL, and set it in
`.env` (and in your Vercel project's environment variables):

```
VITE_FEEDBACK_FORM_ENDPOINT=https://formspree.io/f/xxxxabcd
```

Without this variable the in-app Feedback button still works, but submissions show a
"not configured" error instead of reaching Formspree.

---

## 📊 Monitoring, Analytics & Feedback

- **Vercel Analytics + Speed Insights** (`src/main.tsx`) are wired in automatically once deployed
  on Vercel — enable them under **Project → Analytics** / **Project → Speed Insights** in the
  Vercel dashboard (no extra code needed beyond what's already committed). This satisfies the
  "monitoring/analytics integration" requirement with real page-view and performance data.
- **Custom events** (`wallet_connected`, `hub_initialized`, `purchase_completed`, etc. — see
  `src/hooks/useWallet.ts`, `src/hooks/useContract.ts`) are tracked in code, but **Vercel's free
  Hobby plan does not support Custom Events** (Pro-only, $20/mo). Rather than pay for that, proof
  of wallet interactions uses on-chain data instead — see below.
- **Proof of wallet interactions (on-chain, free, publicly verifiable):** every `init`/`purchase`
  is a real signed Stellar testnet transaction. The contract's full transaction history is public
  at
  `https://stellar.expert/explorer/testnet/contract/CBEPQQWNA4OU3JEAGXOBSCQNHIXPJPV2ZIXYJTQJOBTTD5AQSMFX5CDT` —
  a single screenshot of that page after 10+ distinct testers have interacted is stronger proof
  than self-reported analytics, since anyone can independently verify it. The app's Activity tab
  also links out to Stellar Expert for each individual transaction (`EventStream.tsx`). See
  [`docs/TESTER_LOG.md`](docs/TESTER_LOG.md).
- **Feedback** is collected via the floating "💬 Feedback" button (star rating + comment), which
  posts to your Formspree endpoint; responses land in the Formspree dashboard.

---

## 🧪 Test Output

### Contract tests (5 passing)

```text
running 5 tests
test test::test_init_sets_owner_and_name ... ok
test test::test_purchase_transfers_tokens_and_updates_balance ... ok
test test::test_init_twice_panics - should panic ... ok
test test::test_purchase_zero_amount_panics - should panic ... ok
test test::test_purchase_before_init_panics - should panic ... ok

test result: ok. 5 passed; 0 failed; 0 ignored
```

### Frontend tests (Vitest, 11 passing)

```powershell
npm test
```

Covers `contract.ts` function mapping, contract ID validation, catalog data, Connect Wallet UI
rendering, and the Feedback widget (rating validation, unconfigured-endpoint handling).

---

## 🔄 CI/CD Pipeline

The workflow (`.github/workflows/ci.yml`) runs on every push/PR:

1. **contract-tests** — `cargo test` + WASM build
2. **frontend-tests** — Vitest + production build
3. **integration-check** — `verify-integration.mjs` (Rust ↔ frontend matching)
4. **deploy-testnet** — **Automated** deploy on push to `main`/`master`
5. **lint** — ESLint

---

## ✅ Level 4 Submission Checklist

- [x] Public GitHub repository
- [x] README with complete documentation
- [x] Minimum 15+ meaningful commits
- [x] Live demo link (Vercel)
- [x] **Contract deployment address** (in README + `deployment.json`)
- [x] Screenshot: product UI
- [x] Screenshot: mobile responsive design
- [ ] Screenshot: analytics/monitoring setup — **enable Web Analytics (Hobby/free) in Vercel**, then screenshot
- [ ] Proof of 10+ user wallet interactions — **needs real testers**, then screenshot the contract on [Stellar Expert](https://stellar.expert/explorer/testnet/contract/CBEPQQWNA4OU3JEAGXOBSCQNHIXPJPV2ZIXYJTQJOBTTD5AQSMFX5CDT)
- [ ] Basic user feedback summary — **needs real testers**, see below
- [ ] Demo video link (1–2 minutes) — **still needed**

### What's code-complete vs. what needs you

Everything in the table above through item 12 is implemented and verified in this repo (tests
pass, build passes, lint passes). Three checklist items are **operational, not technical** — they
require actually running the onboarding process with real people, which no amount of code can
substitute for:

1. **10+ real users, proof of wallet interaction**
   - Share the live demo link and ask each tester to connect Freighter (Testnet) and complete at
     least one action (init hub or purchase a supply item). Ready-to-send invite message:
     [`docs/TESTER_OUTREACH.md`](docs/TESTER_OUTREACH.md).
   - Once 10+ distinct testers have interacted, screenshot the contract's public transaction
     history on Stellar Expert as proof (see *Monitoring, Analytics & Feedback* above and
     [`docs/TESTER_LOG.md`](docs/TESTER_LOG.md)).

2. **Basic user feedback summary**
   - Ask each tester to leave a rating + comment via the in-app "💬 Feedback" button before they
     leave.
   - Once you have responses, screenshot the Formspree submissions dashboard, or write a short
     summary (average rating, common comments) into this README.

3. **Demo video (1–2 minutes)**
   - Record: connecting Freighter → funding via Friendbot → initializing the hub → purchasing a
     supply item → viewing the event in the Activity tab. Upload to YouTube/Loom (unlisted is
     fine) and link it here.

---

## 📸 Screenshots

Below are the submission screenshots included in `docs/screenshots/`:

### Product UI (mobile)
![Mobile responsive UI](docs/screenshots/mobile-ui.png)

### GitHub Actions CI/CD pipeline
![CI/CD pipeline](docs/screenshots/ci-pipeline.png)

> **Note:** the CI/CD screenshot above is from an earlier run and includes two failed checks
> from before the Soroban test-target fixes (see commit history). Re-capture this screenshot
> from the [Actions tab](https://github.com/Khanh-09/nova-supply-hub/actions) once a fresh push
> shows all-green so it reflects the current pipeline state.

**Still outstanding for submission** (see *What's code-complete vs. what needs you* above):
1. Analytics/monitoring dashboard screenshot (after enabling Vercel Analytics).
2. Proof-of-10-users screenshot (Vercel Analytics events, once real testers have connected).
3. Feedback summary (Formspree dashboard screenshot or written summary).
4. A 1–2 minute demo video.
5. An up-to-date, all-green CI/CD screenshot (see note above).

---

*Built with ❤️ for the Stellar community.*
