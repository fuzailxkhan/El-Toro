import React, { useEffect, useState } from 'react'
import Navbar from '@components/Navbar'
import Home from '@pages/Home'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { useWeb3React } from '@web3-react/core'
import GoldButton from '@components/Buttons/GoldButton'
import { addChainToMetamask, chainChangeRequest } from '@utils/'
import { styled } from '@mui/material/styles'
import { SupportedChainId, chainConfig } from '../../constants/chains'
import Loader from '@components/Loader'
import { useAppDispatch, useAppSelector } from '@hooks/'
import { Alert, Box, Snackbar, Typography } from '@mui/material'
import { StakeBackground } from '@assets/'
import { useSelector } from 'react-redux'
import { initialStateSnackbar, setSnackbar } from '@redux/slices/themeSlice'
import { ThemeContainer } from './styles'
import { setAvailableContracts } from '@redux/slices/walletSlice'
import {
  AvailableContracts,
  ChainContracts,
  ChainParams,
} from '../../hooks/useContract/types'
import Test from '@pages/Test'
import { useChainId } from 'wagmi';
import { useSwitchChain } from 'wagmi'

const WrongNetworkErrorContainer = styled('div')(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  height: '100vh',
  width: '100vw',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  color: theme.palette.primary.main,
  fontSize: 16,
}))

const Router = () => {
  const [showNetworkError, setShowNetworkError] = useState<boolean | null>(null)

  const { account, chainId } = useWeb3React()
  const chainIdWagmi = useChainId()
  console.log('chain id wagmi', chainIdWagmi)
  
  const { chains, switchChain } = useSwitchChain()
  console.log('chains', chains)

  const snackbarSelector = useAppSelector(state => state.theme.snackbar)
  const availableContracts = useAppSelector(
    state => state.wallet.availableContracts,
  )

  const dispatch = useAppDispatch()

  const handleClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string,
  ) => {
    if (reason === 'clickaway') {
      return
    }
    dispatch(setSnackbar(initialStateSnackbar))
  }

  const txInProgress = useAppSelector(state => state.wallet.txInProgress)

  // new chain configuration
  useEffect(() => {
    if (chainIdWagmi) {
      if (
        chainIdWagmi !== SupportedChainId.VANAR_TESTNET &&
        chainIdWagmi !== SupportedChainId.GOERLI &&
        chainIdWagmi !== SupportedChainId.HARDHAT_NETWORK &&
        chainIdWagmi !== SupportedChainId.SEPOLIA &&
        chainIdWagmi !== SupportedChainId.BSC &&
        chainIdWagmi !== SupportedChainId.MAINNET
      ) {
        setShowNetworkError(true)
      } else setShowNetworkError(false)
    }
  }, [chainIdWagmi])

  // useEffect(() => {
  //   console.log(chainId, 'chainId')
  //   if (
  //     (chainId &&
  //       (chainId === SupportedChainId.VANAR_TESTNET ||
  //       chainId === SupportedChainId.GOERLI)) ||
  //       chainId === SupportedChainId.HARDHAT_NETWORK ||
  //       chainId == SupportedChainId.SEPOLIA ||
  //       chainId == SupportedChainId.ARBITRUM_ONE
  //   ) {
  //     let _chainId: '5' | '78600' | '31337' | '11155111' = chainId as any

  //     dispatch(setAvailableContracts(ChainContracts[_chainId]))
  //   }
  // }, [chainId])

  if (showNetworkError) {
    return (
      <WrongNetworkErrorContainer>
        <div>Unsupported Network, please switch to Vanar Testnet</div>{' '}
        <GoldButton
          style={{ marginTop: 10 }}
          onClick={
            () =>
              switchChain({ chainId: 78600  })
              // chainChangeRequest('0x5C6463', () => console.log('changed'))
              // chainChangeRequest(
              //   `0x${Number(SupportedChainId.VANAR_TESTNET)
              //     .toString(16)
              //     .toUpperCase()}`,
              //   () => console.log('changed'),
              // )
            // addChainToMetamask(chainConfig['0x6648E5'], () => {
            //   console.log('changed')
            // })
          }
        >
          <Typography color="#000" variant="h6">
            Switch Network
          </Typography>
        </GoldButton>
      </WrongNetworkErrorContainer>
    )
  }

  return (
    <BrowserRouter>
      <ThemeContainer container flexDirection={'column'}>
        <Navbar />
        {txInProgress && <Loader />}

        {/* {account ? (
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/info" element={<Info />} />
            <Route path="/test" element={<Test />} />
          </Routes>
        ) : (
          <Typography variant="h4" margin={'auto'} fontWeight={600}>
            Connect your wallet to continue
          </Typography>
        )} */}
        <Routes>
          <Route path="/" element={<Home />} />
          {/* <Route path="/info" element={<Info />} />
          <Route path="/test" element={<Test />} /> */}
        </Routes>
      </ThemeContainer>

      <Snackbar
        open={snackbarSelector.open}
        autoHideDuration={6000}
        onClose={handleClose}
        anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
      >
        <Alert
          onClose={handleClose}
          severity={snackbarSelector.severity}
          sx={{ width: '100%', background: '#000', color: '#FFFFFF' }}
        >
          {snackbarSelector.message}
        </Alert>
      </Snackbar>
    </BrowserRouter>
  )
}

export default Router
