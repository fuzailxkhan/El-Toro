import React, { FC, useCallback, useEffect, useState } from 'react'
import { Connector } from '@web3-react/types'
import {
  ConnectionType,
  getConnection,
  getConnectionName,
} from '../../connection'
import { useAppDispatch } from '@hooks/'
import { setSelectedWallet } from '@redux/slices/walletSlice'
import { useWeb3React } from '@web3-react/core'
import GoldButton from '@components/Buttons/GoldButton'
import OutlinedButton from '@components/Buttons/OutlinedButton'
import { shortenAddress } from '@utils/'
import Toast from '@components/Modals/Toast'
import { Box, Button, Grid, Typography, styled } from '@mui/material'
import ConnectWalletModal from '@components/Modals/ConnectWalletModal'
import { MetaMaskAvatar } from 'react-metamask-avatar'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'

import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import { useWeb3Modal } from '@web3modal/wagmi/react'
import { useAccount, useDisconnect } from 'wagmi'
// import { useNetwork } from 'wagmi'
// import { getChainId } from 'wagmi';

// const ButtonsContainer = styled('div')(() => ({
//   display: 'flex',
//   flexDirection: 'row',
//   alignItems: 'center',
//   // width: '310px',
//   justifyContent: 'center',
//   width:"100%",
//   border:"1px solid blue"
// }))

interface IConnectWalletButton {
  fullWidth?: boolean
}

export const ButtonsContainer = styled('div', {
  shouldForwardProp: prop => prop !== 'fullWidth',
})<IConnectWalletButton>(({ theme, fullWidth }) => ({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  // width: '310px',
  justifyContent: 'center',
  width: fullWidth ? '100%' : 'auto',
}))

export const ConnectWalletButton = styled(Button, {
  shouldForwardProp: prop => prop !== 'fullWidth',
})<IConnectWalletButton>(({ theme, fullWidth }) => ({
  borderRadius: '100px',
  width: fullWidth ? '100%' : 200,
  height: 50,
  fontSize: '16px',
  fontWeight: 600,
  textTransform: 'initial',
  background: '#03D9AF',
  color: '#101010',
}))

type Props = {
  wallets: ConnectionType[]
  fullWidth?: boolean
}

const WalletButtons: FC<Props> = props => {
  const { open } = useWeb3Modal()
  const { disconnect } = useDisconnect()
  const { address, isConnecting, isDisconnected, isConnected } = useAccount()
  // console.log('is connect')

  // (async () => {
  //   const chainId = await getChainId();
  //   console.log('chain id', chainId)
  // })()

  // const { chain } = useNetwork()

  // console.log('chain id', chain)

  console.log('account', { address, isConnected })

  const [modalOpen, setModalOpen] = useState(false)
  // const { open: wagmiOpen, close } = useWeb3Modal()

  const { account, connector } = useWeb3React()

  const [showConnectWalletModal, setShowConnectWalletModal] = useState(false)

  const dispatch = useAppDispatch()

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  // const open = Boolean(anchorEl)
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  useEffect(() => {
    const connectionType = sessionStorage.getItem('connection-type')
    console.log('connection type', connectionType)

    if (connectionType) {
      const connector = getConnection(
        connectionType as ConnectionType,
      )?.connector

      tryActivation(connector)
    }
  }, [])

  const tryActivation = useCallback(
    async (connector: Connector) => {
      const connectionType = getConnection(connector).type

      sessionStorage.setItem('connection-type', connectionType)

      try {
        //  setPendingConnector(connector)
        //  setWalletView(WALLET_VIEWS.PENDING)
        //  dispatch(updateConnectionError({ connectionType, error: undefined }))

        await connector?.activate()
        dispatch(setSelectedWallet(connectionType))
      } catch (error) {
        console.error(`web3-react connection error: ${error}`)
        // dispatch(
        //   updateConnectionError({ connectionType, error: error.message }),
        // )
        // sendAnalyticsEvent(EventName.WALLET_CONNECT_TXN_COMPLETED, {
        //   result: WALLET_CONNECTION_RESULT.FAILED,
        //   wallet_type: getConnectionName(connectionType, getIsMetaMask()),
        // })
      }
    },
    [dispatch],
  )

  useEffect(() => {
    console.log('wallet status changed', { isConnected })
  }, [isConnected])

  function onDisconnectClick() {
    sessionStorage.removeItem('connection-type')
    sessionStorage.removeItem('account')
    sessionStorage.removeItem('signature')

    connector?.deactivate && connector?.deactivate()
    connector?.resetState && connector?.resetState()
  }

  const handleDisconnectWallet = () => {
    console.log('disconnect')
    disconnect()
  }

  return (
    <>
      <ButtonsContainer fullWidth={props.fullWidth ? true : false}>
        {!address ? (
          <ConnectWalletButton
            onClick={(event) => {
              event.preventDefault();
              console.log('click')
              open()
            }}
          >
            Connect Wallet
          </ConnectWalletButton>
        ) : (
          <>
            {shortenAddress(address.toLowerCase(), 4, 8)}
            <Button
              variant="outlined"
              onClick={() => {
                console.log('values', { isConnected, address })
                handleDisconnectWallet()
              }}
              sx={{
                marginLeft: 2,
                marginRight: 1,
                textTransform: 'none',
              }}
            >
              Disconnect
            </Button>
          </>
        )}
        {/* <button onClick={handleDisconnectWallet} >Disconnect</button> */}
        {/* {!account ? (
    
          <ConnectWalletButton
            variant="contained"
            onClick={() => setShowConnectWalletModal(true)}
            fullWidth={props.fullWidth ? true : false}
          >
            Connect Wallet
          </ConnectWalletButton>
        ) : (
          <>
             <Button
              variant="outlined"
              onClick={() => {
                navigator.clipboard.writeText(account)
                setModalOpen(true)
              }}
              sx={{
                marginRight: 1,
                textTransform: 'none',
              }}
            >
              {shortenAddress(account.toLowerCase(), 4, 8)}
            </Button>
            <Button
              variant="contained"
              style={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}
              onClick={onDisconnectClick}
            >
              Disconnect
            </Button> 

            <Box
              onClick={handleClick}
              display={'flex'}
              alignItems={'center'}
              sx={{ cursor: 'pointer' }}
            >
              <MetaMaskAvatar address={account} size={24} />
              <Typography variant="h5" marginLeft={2}>
                {shortenAddress(account.toLowerCase(), 4, 8)}
              </Typography>
              <ArrowDropDownIcon />
            </Box>

            <Menu
              id="basic-menu"
              anchorEl={anchorEl}
              // open={open}
              open={false}
              onClose={handleClose}
              MenuListProps={{
                'aria-labelledby': 'basic-button',
              }}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
            >
              <MenuItem
                onClick={() => {
                  handleClose()
                  onDisconnectClick()
                }}
              >
                Disconnect
              </MenuItem>
            </Menu>
          </>
        )} */}
      </ButtonsContainer>
      <Toast
        open={modalOpen}
        setOpen={setModalOpen}
        message="Address copied to clipboard"
      />

      <ConnectWalletModal
        open={showConnectWalletModal}
        setOpen={setShowConnectWalletModal}
        wallets={props.wallets}
      />
    </>
  )
}

export default WalletButtons
