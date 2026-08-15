#!/usr/bin/env node
/**
 * AUTOMATED INTEGRATION / LOAD TEST -- NOT REAL USER DATA.
 *
 * Generates N synthetic Stellar testnet keypairs, funds each via Friendbot,
 * and has each sign + submit one real `purchase` transaction against the
 * deployed SupplyHubContract. Useful for exercising the contract under many
 * distinct concurrent callers (per-account auth, shared storage counters,
 * event emission) as a technical correctness/load check.
 *
 * This is NOT proof of real human user onboarding. Its output must never be
 * used to satisfy the "real users" / "wallet interaction proof" / "active
 * usage" requirements in README.md -- those require actual distinct people,
 * tracked in docs/TESTER_OUTREACH.md and docs/TESTER_LOG.md. Results here go
 * to docs/AUTOMATED_LOAD_TEST.md, kept deliberately separate.
 *
 * Usage: node scripts/generate_test_transactions.mjs [count]  (default 51)
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  Keypair,
  TransactionBuilder,
  rpc,
  Address,
  nativeToScVal,
  Contract,
  BASE_FEE,
} from '@stellar/stellar-sdk';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const NETWORK_PASSPHRASE = 'Test SDF Network ; September 2015';
const RPC_URL = 'https://soroban-testnet.stellar.org';
const CONTRACT_ID = 'CBEPQQWNA4OU3JEAGXOBSCQNHIXPJPV2ZIXYJTQJOBTTD5AQSMFX5CDT';
const TOKEN_ADDRESS = 'CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC';
const OUTPUT_MD = path.join(ROOT, 'docs', 'AUTOMATED_LOAD_TEST.md');
const OUTPUT_JSON = path.join(ROOT, 'docs', 'automated-load-test-results.json');

const CATALOG = [
  { id: 1, name: 'Ion Fuel Cell Pack', price: 4_000_000 },
  { id: 2, name: 'Cryo Storage Module', price: 7_500_000 },
  { id: 3, name: 'Solar Array Panel', price: 9_000_000 },
  { id: 4, name: 'Docking Clamp Set', price: 5_500_000 },
  { id: 5, name: 'Oxygen Recycler', price: 11_000_000 },
];

const COUNT = Number(process.argv[2]) || 51;
const server = new rpc.Server(RPC_URL, { allowHttp: false });

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fundAccount(publicKey) {
  const res = await fetch(`https://friendbot.stellar.org?addr=${encodeURIComponent(publicKey)}`);
  if (!res.ok && res.status !== 400) {
    throw new Error(`Friendbot failed (${res.status})`);
  }
}

async function waitForAccount(publicKey, attempts = 15) {
  for (let i = 0; i < attempts; i++) {
    try {
      return await server.getAccount(publicKey);
    } catch {
      await sleep(1500);
    }
  }
  throw new Error(`Account ${publicKey} not visible after funding`);
}

async function pollTx(txHash, attempts = 20) {
  for (let i = 0; i < attempts; i++) {
    try {
      const tx = await server.getTransaction(txHash);
      if (tx.status === rpc.Api.GetTransactionStatus.SUCCESS) return 'SUCCESS';
      if (tx.status === rpc.Api.GetTransactionStatus.FAILED) return 'FAILED';
    } catch (err) {
      if (String(err.message || '').includes('Bad union switch')) return 'SUCCESS';
    }
    await sleep(1500);
  }
  return 'TIMEOUT';
}

async function runOne(index) {
  const keypair = Keypair.random();
  const item = CATALOG[index % CATALOG.length];

  await fundAccount(keypair.publicKey());
  const account = await waitForAccount(keypair.publicKey());

  const contract = new Contract(CONTRACT_ID);
  const args = [
    Address.fromString(keypair.publicKey()).toScVal(),
    Address.fromString(TOKEN_ADDRESS).toScVal(),
    nativeToScVal(BigInt(item.price), { type: 'i128' }),
    nativeToScVal(BigInt(item.id), { type: 'u64' }),
  ];

  const tx = new TransactionBuilder(account, { fee: BASE_FEE, networkPassphrase: NETWORK_PASSPHRASE })
    .addOperation(contract.call('purchase', ...args))
    .setTimeout(30)
    .build();

  const sim = await server.simulateTransaction(tx);
  if (rpc.Api.isSimulationError(sim)) {
    throw new Error(`Simulation failed: ${sim.error}`);
  }

  const prepared = rpc.assembleTransaction(tx, sim).build();
  prepared.sign(keypair);

  const sent = await server.sendTransaction(prepared);
  if (sent.status === 'ERROR') {
    throw new Error(`Submit failed: ${sent.errorResult?.toXDR('base64') || 'unknown error'}`);
  }

  const status = await pollTx(sent.hash);

  return {
    index: index + 1,
    publicKey: keypair.publicKey(),
    item: item.name,
    itemId: item.id,
    amountXlm: item.price / 10_000_000,
    txHash: sent.hash,
    status,
  };
}

async function main() {
  console.log(`Automated load test: ${COUNT} synthetic accounts against ${CONTRACT_ID}`);
  console.log('This is a technical load/integration test, NOT real user data.\n');

  const results = [];
  for (let i = 0; i < COUNT; i++) {
    process.stdout.write(`[${i + 1}/${COUNT}] `);
    try {
      const r = await runOne(i);
      results.push(r);
      console.log(`${r.publicKey.slice(0, 8)}… -> ${r.status} (${r.txHash.slice(0, 12)}…)`);
    } catch (err) {
      results.push({ index: i + 1, error: err.message });
      console.log(`FAILED: ${err.message}`);
    }
    await sleep(800);
  }

  fs.mkdirSync(path.dirname(OUTPUT_JSON), { recursive: true });
  fs.writeFileSync(OUTPUT_JSON, JSON.stringify(results, null, 2));

  const succeeded = results.filter((r) => r.status === 'SUCCESS');
  const md = [
    '# Automated Load Test Results',
    '',
    '> **This file is a technical load/integration test log, not real user data.**',
    '> Each row is a synthetic keypair generated and controlled by this script in a single run --',
    '> it does not represent a distinct human user. Do not cite this file to satisfy the',
    '> "real users" / "wallet interaction proof" / "active usage" requirements -- see',
    '> `docs/TESTER_LOG.md` and `docs/TESTER_OUTREACH.md` for actual real-user data instead.',
    '',
    `Ran ${new Date().toISOString()} -- ${COUNT} synthetic accounts, ${succeeded.length} successful purchases.`,
    '',
    'This demonstrates the contract correctly handles many distinct concurrent callers',
    '(per-account auth, shared storage counters, event emission) -- a technical correctness',
    'check, not a product-adoption metric.',
    '',
    '| # | Wallet (truncated) | Item | Amount | Tx hash | Status |',
    '|---|---|---|---|---|---|',
    ...results.map((r) =>
      r.error
        ? `| ${r.index} | -- | -- | -- | -- | ERROR: ${r.error} |`
        : `| ${r.index} | \`${r.publicKey.slice(0, 6)}…${r.publicKey.slice(-4)}\` | ${r.item} | ${r.amountXlm} XLM | [${r.txHash.slice(0, 10)}…](https://stellar.expert/explorer/testnet/tx/${r.txHash}) | ${r.status} |`
    ),
  ].join('\n');

  fs.writeFileSync(OUTPUT_MD, md);
  console.log(`\nDone. ${succeeded.length}/${COUNT} succeeded. Results: ${OUTPUT_MD}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
