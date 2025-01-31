import React, { FC, useMemo } from 'react'
import { Web3ReactHooks, Web3ReactProvider } from '@web3-react/core'
import { Connector } from '@web3-react/types'
import { Connection, getConnectionName } from '../../connection'
import useOrderedConnections from '../../hooks/useOrderedConnections'
import Router from '@components/Router'

type Props = unknown

const Web3Provider: FC<Props> = () => {
  const connections = useOrderedConnections()

  const connectors: [Connector, Web3ReactHooks][] = connections.map(
    ({ hooks, connector }) => [connector, hooks],
  )

  const key = useMemo(
    () =>
      connections
        .map(({ type }: Connection) => getConnectionName(type))
        .join('-'),
    [connections],
  )

  return (
    <Web3ReactProvider connectors={connectors} key={key}>
      <Router />
    </Web3ReactProvider>
  )
}

export default Web3Provider
