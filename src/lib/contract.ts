/** Nova Supply Hub — contract configuration and function mapping */

export const CONTRACT_ID = (import.meta.env.VITE_CONTRACT_ID || '').trim();

export const EXAMPLE_TX_HASH = (import.meta.env.VITE_EXAMPLE_TX_HASH || '').trim();

export const NETWORK = import.meta.env.VITE_NETWORK || 'TESTNET';

export const NETWORK_PASSPHRASE =
  NETWORK === 'MAINNET'
    ? 'Public Global Stellar Network ; September 2015'
    : 'Test SDF Network ; September 2015';

export const RPC_URL =
  import.meta.env.VITE_RPC_URL || 'https://soroban-testnet.stellar.org';

export const HORIZON_URL =
  import.meta.env.VITE_HORIZON_URL || 'https://horizon-testnet.stellar.org';

export const FRIENDBOT_URL =
  import.meta.env.VITE_FRIENDBOT_URL || 'https://friendbot.stellar.org';

/** Native XLM Stellar Asset Contract on testnet */
export const DEFAULT_TOKEN =
  import.meta.env.VITE_TOKEN_ADDRESS ||
  'CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC';

/** Stellar contract IDs are 56 chars: C + 55 base32 chars */
export function isValidContractId(id: string): boolean {
  return typeof id === 'string' && /^C[A-Z2-7]{55}$/.test(id);
}

/**
 * Contract function names — must match Rust #[contractimpl] on SupplyHubContract.
 * Used by stellarTx.ts for cross-check validation in CI and frontend.
 */
export const CONTRACT_FUNCTIONS = {
  INIT: 'init',
  PURCHASE: 'purchase',
  GET_BALANCE: 'get_balance',
  GET_OWNER: 'get_owner',
  GET_NAME: 'get_name',
  GET_SHIPMENT_COUNT: 'get_shipment_count',
} as const;

export type ContractFunctionName =
  (typeof CONTRACT_FUNCTIONS)[keyof typeof CONTRACT_FUNCTIONS];

export type ScValSpec =
  | { address: string }
  | { string: string }
  | { i128: string }
  | { u64: string };

/** Build ScVal argument specs for SupplyHubContract::init */
export function buildInitArgs(owner: string, name: string): ScValSpec[] {
  return [{ address: owner }, { string: name }];
}

/** Build ScVal argument specs for SupplyHubContract::purchase */
export function buildPurchaseArgs(
  customer: string,
  tokenAddress: string,
  amount: number | bigint,
  shipmentId: number
): ScValSpec[] {
  return [
    { address: customer },
    { address: tokenAddress },
    { i128: amount.toString() },
    { u64: shipmentId.toString() },
  ];
}

export interface SupplyItem {
  id: number;
  name: string;
  price: number;
  emoji: string;
  desc: string;
  category: string;
  stock?: number;
  tag?: 'popular' | 'new' | 'limited';
}

/** Catalog of orbital supply items available for purchase */
export const SUPPLY_CATALOG: SupplyItem[] = [
  {
    id: 1,
    name: 'Ion Fuel Cell Pack',
    price: 4_000_000,
    emoji: '⚡',
    desc: 'High-density propulsion fuel for deep-space vessels',
    category: 'Propulsion',
    stock: 24,
    tag: 'popular',
  },
  {
    id: 2,
    name: 'Cryo Storage Module',
    price: 7_500_000,
    emoji: '🧊',
    desc: 'Zero-loss biological sample preservation unit',
    category: 'Life Support',
    stock: 12,
  },
  {
    id: 3,
    name: 'Solar Array Panel',
    price: 9_000_000,
    emoji: '☀️',
    desc: 'Foldable photovoltaic array for station power',
    category: 'Energy',
    stock: 8,
    tag: 'new',
  },
  {
    id: 4,
    name: 'Docking Clamp Set',
    price: 5_500_000,
    emoji: '🔗',
    desc: 'Universal orbital docking hardware kit',
    category: 'Infrastructure',
    stock: 31,
  },
  {
    id: 5,
    name: 'Oxygen Recycler',
    price: 11_000_000,
    emoji: '💨',
    desc: 'Closed-loop atmospheric regeneration system',
    category: 'Life Support',
    stock: 3,
    tag: 'limited',
  },
];
