# Nova Supply Hub — Submission Guide

This guide maps each **AI Review step (6/6)** to files in this repository.

## Step 1: Smart Contract Folder Structure ✅

```
contracts/supply-hub/
├── Cargo.toml
└── src/
    ├── lib.rs      # SupplyHubContract
    └── test.rs     # Unit tests
```

## Step 2: Smart Contract Code Validation ✅

Custom supply-hub logic (not Hello World):

- `init` — owner + hub name storage
- `purchase` — SAC cross-contract XLM transfer + shipment counter
- `get_balance`, `get_shipment_count`, `get_owner`, `get_name`
- Events: `init`, `buy`
- Error codes: AlreadyInitialized, NotInitialized, AmountMustBePositive

## Step 3: Connect Wallet Feature ✅

| File | Purpose |
|------|---------|
| `src/components/WalletConnect.tsx` | Connect / Disconnect UI |
| `src/hooks/useWallet.ts` | Freighter API integration |
| `src/context/WalletContext.tsx` | React context provider |
| `src/test/wallet.test.tsx` | Vitest coverage |

## Step 4: README & Deployment Validation ✅

- README **Deployment Information** table with Contract ID field
- `deployment.json` — machine-readable deploy record (Contract ID + tx hashes)
- `scripts/deploy-contract.mjs` — local automated deploy
- CI job **`deploy-testnet`** — automated deploy on push to main (not manual)

## Step 5: Smart Contract Integration Codebase ✅

| File | Purpose |
|------|---------|
| `src/lib/contract.ts` | Config, `CONTRACT_FUNCTIONS`, arg builders |
| `src/lib/stellarTx.ts` | invoke, simulate, events |
| `src/hooks/useContract.ts` | Business logic hook |
| `src/hooks/useEventStream.ts` | Real-time events |

## Step 6: Cross-Check Contract ↔ Frontend ✅

Run locally:

```bash
node scripts/verify-integration.mjs
```

CI job **`integration-check`** runs the same script.

---

## Before You Submit

1. Push to GitHub (10+ meaningful commits)
2. Run deploy: `npm run deploy:contract`
3. Copy Contract ID + tx hash into README Deployment table
4. Deploy frontend to Vercel — set env vars from `.env`
5. Add screenshots to `docs/screenshots/`
6. Record 1–2 min demo video
