import { createConfig, http } from '@wagmi/core'
import { chainConfig, chainIdToContracts } from '../../constants/chains'
import { arbitrum, mainnet, bscTestnet } from 'wagmi/chains'

const vanarChain = chainConfig['78600']

// new chain configuration
  /* @ts-ignore */
export const config = createConfig({
  chains: [vanarChain, bscTestnet, mainnet],
  transports: {
    [vanarChain.id]: http(),
    [bscTestnet.id]: http(),
    [mainnet.id]: http(),
  },
})
