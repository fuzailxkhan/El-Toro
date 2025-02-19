import { createConfig, http } from '@wagmi/core'
import { chainConfig, chainIdToContracts } from '../../constants/chains'
import { arbitrum, mainnet, bscTestnet, holesky, sepolia } from 'wagmi/chains'

// new chain configuration
  /* @ts-ignore */
export const config = createConfig({
  chains: [holesky, sepolia],
  transports: {
    [holesky.id]: http(),
    [sepolia.id]: http(),

  },
})
