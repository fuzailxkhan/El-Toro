import React, { useMemo } from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { store } from '@redux/configureStore'
import Web3Provider from '@components/Web3Provider'
import MuiTheme from './theme'

import './index.css'

// WalletConnect does not work with webpack 5 i.e. react@18+
// This is required to make it work
import { Buffer } from 'buffer'
import { Web3ModalProvider } from '@components/Wagmi/index'
import useOrderedConnections from '../src/hooks/useOrderedConnections'
import { Web3ReactHooks, Web3ReactProvider } from '@web3-react/core'
import { getConnectionName } from './connection'
// eslint-disable-next-line @typescript-eslint/no-explicit-any
;(window as unknown as any).Buffer = (window as unknown as any).Buffer || Buffer

console.log('started')

// console.log = console.error = console.warn = () => {}

const App = () => {
  const connections = useOrderedConnections()
  const connectors: any = connections.map(({ hooks, connector }: any) => [
    connector,
    hooks,
  ])
  const key = useMemo(
    () => connections.map(({ type }: any) => getConnectionName(type)).join('-'),
    [connections],
  )

  return (
    <div>
      <Web3ReactProvider connectors={connectors} key={key}>
        <Web3ModalProvider />
      </Web3ReactProvider>
    </div>
  )
}

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <MuiTheme>
        <App />
      </MuiTheme>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root'),
)
