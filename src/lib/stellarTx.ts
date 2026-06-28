import {
  Contract,
  rpc,
  TransactionBuilder,
  nativeToScVal,
  scValToNative,
  Address,
  BASE_FEE,
} from '@stellar/stellar-sdk';
import {
  CONTRACT_ID,
  isValidContractId,
  NETWORK_PASSPHRASE,
  RPC_URL,
  CONTRACT_FUNCTIONS,
  buildInitArgs,
  buildPurchaseArgs,
  type ScValSpec,
  type ContractFunctionName,
} from './contract';
import { formatStellarError } from './account';

export type SignTransactionFn = (
  xdr: string,
  opts: { networkPassphrase: string; address: string }
) => Promise<string>;

export type TxPhase =
  | 'loading-account'
  | 'simulating'
  | 'preparing'
  | 'awaiting-signature'
  | 'submitting'
  | 'confirming';

export interface InvokeOptions {
  onPhase?: (phase: TxPhase) => void;
}

export interface TxResult {
  hash: string;
  status: string;
  result?: unknown;
}

export interface ContractEvent {
  id: string;
  type?: string;
  ledger?: number;
  txHash?: string;
  contractId?: string;
  topics: unknown[];
  value: unknown;
  timestamp?: string | null;
}

const server = new rpc.Server(RPC_URL, {
  allowHttp: RPC_URL.startsWith('http://'),
});

function scValFromSpec(spec: ScValSpec) {
  if ('address' in spec) return Address.fromString(spec.address).toScVal();
  if ('string' in spec) return nativeToScVal(spec.string, { type: 'string' });
  if ('i128' in spec) return nativeToScVal(BigInt(spec.i128), { type: 'i128' });
  if ('u64' in spec) return nativeToScVal(BigInt(spec.u64), { type: 'u64' });
  throw new Error(`Unsupported ScVal spec: ${JSON.stringify(spec)}`);
}

function getContract(): Contract {
  if (!isValidContractId(CONTRACT_ID)) {
    throw new Error(
      'Invalid contract ID. Set VITE_CONTRACT_ID to a 56-character Stellar contract address.'
    );
  }
  return new Contract(CONTRACT_ID);
}

/** Simulate a read-only contract call (no wallet signature required). */
export async function simulateContractCall(
  functionName: ContractFunctionName,
  args: ScValSpec[] = []
) {
  const DUMMY_KEY = 'GAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWHF';

  let acct;
  try {
    acct = await server.getAccount(DUMMY_KEY);
  } catch {
    acct = {
      accountId: () => DUMMY_KEY,
      sequenceNumber: () => '0',
      incrementSequenceNumber: () => {},
      sequence: '0',
      account_id: DUMMY_KEY,
    };
  }

  const contract = getContract();
  const scArgs = args.map(scValFromSpec);

  const tx = new TransactionBuilder(acct, {
    fee: BASE_FEE,
    networkPassphrase: NETWORK_PASSPHRASE,
  })
    .addOperation(contract.call(functionName, ...scArgs))
    .setTimeout(30)
    .build();

  const sim = await server.simulateTransaction(tx);
  if (rpc.Api.isSimulationError(sim)) {
    throw new Error(sim.error || 'Simulation failed');
  }
  return sim;
}

/** Build, sign (via Freighter), and submit a contract invocation transaction. */
export async function invokeContract(
  functionName: ContractFunctionName,
  args: ScValSpec[],
  publicKey: string,
  signTransaction: SignTransactionFn,
  options: InvokeOptions = {}
): Promise<TxResult> {
  const { onPhase } = options;

  onPhase?.('loading-account');
  let account;
  try {
    account = await server.getAccount(publicKey);
  } catch (err) {
    const { message } = formatStellarError(err);
    throw new Error(message);
  }

  const contract = getContract();
  const scArgs = args.map(scValFromSpec);

  const tx = new TransactionBuilder(account, {
    fee: BASE_FEE,
    networkPassphrase: NETWORK_PASSPHRASE,
  })
    .addOperation(contract.call(functionName, ...scArgs))
    .setTimeout(30)
    .build();

  onPhase?.('simulating');
  const sim = await server.simulateTransaction(tx);
  if (rpc.Api.isSimulationError(sim)) {
    const { message } = formatStellarError(new Error(sim.error || 'Simulation failed'));
    throw new Error(message || `Simulation failed for ${functionName}`);
  }

  onPhase?.('preparing');
  let preparedTx;
  try {
    preparedTx = rpc.assembleTransaction(tx, sim).build();
  } catch (err) {
    const msg = (err as Error)?.message || String(err);
    if (msg.includes('Bad union switch') || msg.includes('XDR') || msg.includes('union')) {
      const manualTx = new TransactionBuilder(account, {
        fee: String(Number(sim.minResourceFee || 10000) + 10000),
        networkPassphrase: NETWORK_PASSPHRASE,
      })
        .addOperation(contract.call(functionName, ...scArgs))
        .setTimeout(30);
      if (sim.transactionData) {
        manualTx.setSorobanData(sim.transactionData);
      }
      preparedTx = manualTx.build();
    } else {
      throw new Error(`Failed to prepare transaction: ${msg}`);
    }
  }

  onPhase?.('awaiting-signature');
  const signedXdr = await signTransaction(preparedTx.toXDR(), {
    networkPassphrase: NETWORK_PASSPHRASE,
    address: publicKey,
  });

  if (!signedXdr) {
    throw new Error('Transaction signing was cancelled');
  }

  onPhase?.('submitting');
  const signedTx = TransactionBuilder.fromXDR(signedXdr, NETWORK_PASSPHRASE);
  const result = await server.sendTransaction(signedTx);

  if (result.status === 'ERROR') {
    throw new Error(result.errorResult?.toXDR('base64') || 'Transaction failed');
  }

  onPhase?.('confirming');
  return pollTransaction(result.hash);
}

async function pollTransaction(hash: string, maxAttempts = 30): Promise<TxResult> {
  for (let i = 0; i < maxAttempts; i++) {
    try {
      const tx = await server.getTransaction(hash);
      if (tx.status === rpc.Api.GetTransactionStatus.SUCCESS) {
        return { hash, status: 'SUCCESS', result: tx };
      }
      if (tx.status === rpc.Api.GetTransactionStatus.FAILED) {
        throw new Error(`Transaction ${hash} failed on-chain`);
      }
    } catch (err) {
      const msg = (err as Error).message;
      if (msg.includes('Bad union switch')) {
        return { hash, status: 'SUCCESS', result: { status: 'SUCCESS' } };
      }
      if (msg.includes('failed on-chain')) throw err;
    }
    await new Promise((r) => setTimeout(r, 2000));
  }
  return { hash, status: 'PENDING' };
}

/** Call SupplyHubContract::init */
export async function initSupplyHub(
  owner: string,
  name: string,
  publicKey: string,
  signTransaction: SignTransactionFn,
  options?: InvokeOptions
) {
  return invokeContract(
    CONTRACT_FUNCTIONS.INIT,
    buildInitArgs(owner, name),
    publicKey,
    signTransaction,
    options
  );
}

/** Call SupplyHubContract::purchase */
export async function purchaseSupply(
  customer: string,
  tokenAddress: string,
  amount: number,
  shipmentId: number,
  publicKey: string,
  signTransaction: SignTransactionFn,
  options?: InvokeOptions
) {
  return invokeContract(
    CONTRACT_FUNCTIONS.PURCHASE,
    buildPurchaseArgs(customer, tokenAddress, amount, shipmentId),
    publicKey,
    signTransaction,
    options
  );
}

/** Read contract balance via simulation — maps to get_balance */
export async function getContractBalance(): Promise<number> {
  try {
    const sim = await simulateContractCall(CONTRACT_FUNCTIONS.GET_BALANCE, []);
    if (sim.result?.retval) {
      return Number(scValToNative(sim.result.retval));
    }
  } catch (err) {
    console.warn('Could not fetch balance:', (err as Error).message);
  }
  return 0;
}

/** Read shipment count — maps to get_shipment_count */
export async function getShipmentCount(): Promise<number> {
  try {
    const sim = await simulateContractCall(CONTRACT_FUNCTIONS.GET_SHIPMENT_COUNT, []);
    if (sim.result?.retval) {
      return Number(scValToNative(sim.result.retval));
    }
  } catch (err) {
    console.warn('Could not fetch shipment count:', (err as Error).message);
  }
  return 0;
}

/** Stream contract events via Soroban RPC getEvents polling */
export async function fetchContractEvents(startLedger: number | null = null): Promise<ContractEvent[]> {
  let latest;
  try {
    latest = await server.getLatestLedger();
  } catch (err) {
    if ((err as Error).message.includes('Bad union switch')) return [];
    throw err;
  }

  const from = startLedger ?? Math.max(1, latest.sequence - 1000);

  if (!isValidContractId(CONTRACT_ID)) return [];

  try {
    const response = await server.getEvents({
      startLedger: from,
      endLedger: latest.sequence,
      filters: [{ type: 'contract', contractIds: [CONTRACT_ID] }],
    });

    return (response.events || []).map((evt) => ({
      id: evt.id || `${evt.ledger}-${evt.txHash}`,
      type: evt.type,
      ledger: evt.ledger,
      txHash: evt.txHash,
      contractId: evt.contractId?.toString?.() ?? evt.contractId,
      topics:
        evt.topic?.map((t) => {
          try {
            return scValToNative(t);
          } catch {
            return t;
          }
        }) ?? [],
      value: evt.value
        ? (() => {
            try {
              return scValToNative(evt.value);
            } catch {
              return evt.value;
            }
          })()
        : null,
      timestamp: evt.ledgerClosedAt || null,
    }));
  } catch (err) {
    console.error('Error fetching events:', err);
    return [];
  }
}

export { server, CONTRACT_ID, NETWORK_PASSPHRASE };
