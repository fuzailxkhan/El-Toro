import { SupportedChainId } from './chains'

// new chain configuration
export const RPC_URLS: { [key in SupportedChainId]: string[] } = {
  [SupportedChainId.MAINNET]: ['https://ethereum-rpc.publicnode.com'],
  [SupportedChainId.ARBITRUM_ONE]: ['https://goerli.infura.io/v3/'],
  [SupportedChainId.GOERLI]: ['https://goerli.infura.io/v3/'],
  [SupportedChainId.VANAR_TESTNET]: ['https://explorer-vanguard.vanarchain.com/'],
  [SupportedChainId.HARDHAT_NETWORK]: ['http://127.0.0.1:8545/'],
  [SupportedChainId.SEPOLIA]: ['https://sepolia.infura.io/v3/'],
  [SupportedChainId.BSC]: ['https://data-seed-prebsc-1-s1.binance.org:8545/'],
  // https://ethereum-sepolia-rpc.publicnode.com
  // https://rpc-sepolia.vanarchain.com/
}
