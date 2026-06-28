import { describe, it, expect } from 'vitest';
import {
  CONTRACT_FUNCTIONS,
  buildInitArgs,
  buildPurchaseArgs,
  isValidContractId,
  SUPPLY_CATALOG,
} from '../lib/contract';

describe('contract.ts — function mapping matches SupplyHubContract', () => {
  it('exports all Rust contract method names', () => {
    expect(CONTRACT_FUNCTIONS.INIT).toBe('init');
    expect(CONTRACT_FUNCTIONS.PURCHASE).toBe('purchase');
    expect(CONTRACT_FUNCTIONS.GET_BALANCE).toBe('get_balance');
    expect(CONTRACT_FUNCTIONS.GET_OWNER).toBe('get_owner');
    expect(CONTRACT_FUNCTIONS.GET_NAME).toBe('get_name');
    expect(CONTRACT_FUNCTIONS.GET_SHIPMENT_COUNT).toBe('get_shipment_count');
  });

  it('buildInitArgs produces owner + name specs', () => {
    const args = buildInitArgs('GABC123', 'Nova Supply Hub');
    expect(args).toHaveLength(2);
    expect(args[0]).toEqual({ address: 'GABC123' });
    expect(args[1]).toEqual({ string: 'Nova Supply Hub' });
  });

  it('buildPurchaseArgs matches purchase(customer, token, amount, shipment_id)', () => {
    const args = buildPurchaseArgs('GCUSTOMER', 'CTOKEN', 5_000_000, 42);
    expect(args).toHaveLength(4);
    expect(args[0]).toEqual({ address: 'GCUSTOMER' });
    expect(args[1]).toEqual({ address: 'CTOKEN' });
    expect(args[2]).toEqual({ i128: '5000000' });
    expect(args[3]).toEqual({ u64: '42' });
  });

  it('validates Stellar contract IDs', () => {
    expect(isValidContractId('CALNBNJF7HWOU2T4H33JSOWOZX57NPAHEVENJKDFEWE7363PKF62HCAI')).toBe(true);
    expect(isValidContractId('invalid')).toBe(false);
    expect(isValidContractId('')).toBe(false);
  });

  it('supply catalog has priced items with optional metadata', () => {
    expect(SUPPLY_CATALOG.length).toBeGreaterThanOrEqual(4);
    SUPPLY_CATALOG.forEach((item) => {
      expect(item.price).toBeGreaterThan(0);
      expect(item.id).toBeGreaterThan(0);
      if (item.stock !== undefined) expect(item.stock).toBeGreaterThanOrEqual(0);
    });
  });
});
