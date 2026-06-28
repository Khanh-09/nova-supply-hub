/**
 * Cross-check: frontend CONTRACT_FUNCTIONS must match Rust #[contractimpl] methods.
 * Run in CI as integration-check job.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const libRs = fs.readFileSync(
  path.join(ROOT, 'contracts/supply-hub/src/lib.rs'),
  'utf8'
);

const rustMethods = [...libRs.matchAll(/pub fn (\w+)\(/g)]
  .map((m) => m[1])
  .filter((name) => name !== 'test');

const expectedFrontend = {
  init: 'INIT',
  purchase: 'PURCHASE',
  get_balance: 'GET_BALANCE',
  get_owner: 'GET_OWNER',
  get_name: 'GET_NAME',
  get_shipment_count: 'GET_SHIPMENT_COUNT',
};

const contractTs = fs.readFileSync(path.join(ROOT, 'src/lib/contract.ts'), 'utf8');
const stellarTxTs = fs.readFileSync(path.join(ROOT, 'src/lib/stellarTx.ts'), 'utf8');

let failed = false;

for (const rustName of Object.keys(expectedFrontend)) {
  if (!rustMethods.includes(rustName)) {
    console.error(`❌ Rust contract missing method: ${rustName}`);
    failed = true;
  }
}

for (const [rustName, constName] of Object.entries(expectedFrontend)) {
  const pattern = new RegExp(`${constName}:\\s*'${rustName}'`);
  if (!pattern.test(contractTs)) {
    console.error(`❌ contract.ts missing mapping: ${constName} -> '${rustName}'`);
    failed = true;
  }
}

const txFunctions = ['initSupplyHub', 'purchaseSupply', 'getContractBalance', 'getShipmentCount'];
for (const fn of txFunctions) {
  if (!stellarTxTs.includes(`export async function ${fn}`)) {
    console.error(`❌ stellarTx.ts missing export: ${fn}`);
    failed = true;
  }
}

const hookFiles = ['useWallet.ts', 'useContract.ts', 'useEventStream.ts'];
for (const hook of hookFiles) {
  const hookPath = path.join(ROOT, 'src/hooks', hook);
  if (!fs.existsSync(hookPath)) {
    console.error(`❌ Missing hook: src/hooks/${hook}`);
    failed = true;
  }
}

if (!fs.existsSync(path.join(ROOT, 'src/components/WalletConnect.tsx'))) {
  console.error('❌ Missing WalletConnect component');
  failed = true;
}

if (failed) {
  process.exit(1);
}

console.log('✅ Integration check passed');
console.log(`   Rust methods: ${rustMethods.join(', ')}`);
console.log(`   Frontend hooks: ${hookFiles.join(', ')}`);
console.log('   contract.ts + stellarTx.ts aligned with SupplyHubContract');
