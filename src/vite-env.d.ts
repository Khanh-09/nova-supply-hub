/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_NETWORK: string;
  readonly VITE_CONTRACT_ID: string;
  readonly VITE_EXAMPLE_TX_HASH: string;
  readonly VITE_RPC_URL: string;
  readonly VITE_HORIZON_URL: string;
  readonly VITE_TOKEN_ADDRESS: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
