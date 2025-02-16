import { createConfig, http } from '@wagmi/core'
import { chainConfig, chainIdToContracts } from '../../constants/chains'
import { arbitrum, mainnet, bscTestnet, holesky } from 'wagmi/chains'

// new chain configuration
  /* @ts-ignore */
export const config = createConfig({
  chains: [holesky],
  transports: {
    [holesky.id]: http(),
  },
})
