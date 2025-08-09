import { Connection, clusterApiUrl } from '@solana/web3.js'
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base'
import { PhantomWalletAdapter, SolflareWalletAdapter } from '@solana/wallet-adapter-wallets'

export const SOLANA_NETWORK = WalletAdapterNetwork.Devnet
export const SOLANA_RPC_URL = clusterApiUrl(SOLANA_NETWORK)

export const connection = new Connection(SOLANA_RPC_URL, 'confirmed')

export const wallets = [
  new PhantomWalletAdapter(),
  new SolflareWalletAdapter(),
] 