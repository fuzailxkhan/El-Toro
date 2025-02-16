import { useCallback, useEffect, useState } from 'react'

import { Button, Chip, Grid, Input, Typography } from '@mui/material'
import { useAppDispatch } from '@hooks/'
import {
  setAvailableContracts,
  setTxInProgress,
} from '@redux/slices/walletSlice'
import { setSnackbar } from '@redux/slices/themeSlice'
import { ethers } from 'ethers'
import BigNumber from 'bignumber.js'
import {
  SupportedChainId,
  chainConfig,
  chainIdToContracts,
} from '../../constants/chains'
import { VanarToken } from '@assets/index'
import { StakingContainer, InputContainer } from '@pages/Home/styles'
import WalletButtons from '@components/WalletButtons'
import { ConnectionType } from '../../connection'
import { validateAndFormatInput } from '@utils/index'
import { ChainContracts } from '../../hooks/useContract/types'
import {
  useAccount,
  useBalance,
  usePublicClient,
  useWriteContract,
  useChainId,
  useWaitForTransactionReceipt,
} from 'wagmi'
import { useWeb3Modal } from '@web3modal/wagmi/react'
import {
  estimateGas,
  getBalance as getBalanceWagmi,
  simulateContract,
  estimateFeesPerGas,
  // writeContract,
} from '@wagmi/core'
import { Address, createPublicClient } from 'viem'
import { http, createConfig, prepareTransactionRequest } from '@wagmi/core'
import { arbitrum, mainnet, bscTestnet } from 'wagmi/chains'
import { config } from './configuration'
import { farmingAbi, farmingContractAddress } from './contract'

// import { stakingManagerAbi, stakingManagerAddress } from '../../constants/contracts'

// import { useBalance } from 'wagmi';

const Stake = () => {
  const [depositAmount, setDepositAmount] = useState('')
  const [error, setError] = useState('')

  const [balance, setBalance] = useState('0')
  const [activeLockupOption, setActiveLockupOption] = useState(0)

  const chainId = useChainId()

  const { open } = useWeb3Modal()
  const { address, isConnecting, isDisconnected, isConnected } = useAccount()

  const {
    writeContract,
    data,
    isError,
    writeContractAsync,
    isPending,
    isSuccess,
  } = useWriteContract()

  console.log('chain id', chainId)
  const contractsAndAbis = chainIdToContracts[chainId]
  const { stakingManagerAbi = '', stakingManagerAddress = '' } =
    contractsAndAbis ?? {}

  console.log('config', config)

  const getBalanceFromWagmi = async () => {
    if (address) {
      const balanceWagmi = await getBalanceWagmi(config, {
        address,
        blockTag: 'latest',
      })
      const { value, decimals } = balanceWagmi
      const formattedValue = ethers.utils.formatEther(value)
      return formattedValue
    }
  }

  useEffect(() => {
    console.log('new use effe running chain id', chainId)
    ;(async () => {
      const balance = await getBalanceFromWagmi()
      setBalance(balance ?? '0')
    })()
  }, [address, chainId])

  const dispatch = useAppDispatch()

  const {
    status,
    isSuccess: isTxSuccess,
    isError: isTxError,
  } = useWaitForTransactionReceipt({ hash: data })
  // console.log('confirmations', isTxError, status)

  useEffect(() => {
    ;(async () => {
      if (isTxSuccess) {
        const balance = await getBalanceFromWagmi()
        setBalance(balance ?? '0')
        dispatch(setTxInProgress(false))
        dispatch(
          setSnackbar({
            message: `Transaction successful. You staked ${depositAmount} tokens`,
            open: true,
            severity: 'success',
          }),
        )
        setDepositAmount('')
      }
    })()
  }, [isTxSuccess])

  // const onStake = useCallback(async () => {
  //   // console.clear()
  //   if (depositAmount > balance) {
  //     console.log('here check in the iff')
  //     dispatch(
  //       setSnackbar({
  //         message: 'Insufficient Balance',
  //         open: true,
  //         severity: 'error',
  //       }),
  //     )

  //     return
  //   }

  //   dispatch(setTxInProgress(true))

  //   // try {

  //   try {
  //     console.log('on stake chala', depositAmount)
  //     const amount: any = ethers.utils.parseEther(depositAmount)
  //     console.log('amount', amount)

  //     console.log('params', { address, amount, activeLockupOption })

  //     if (address && stakingManagerAbi && stakingManagerAddress) {
  //       /* @ts-ignore */
  //       const contractRes = await writeContractAsync({
  //         value: amount,
  //         abi: stakingManagerAbi,
  //         address: stakingManagerAddress,
  //         functionName: 'stake',
  //         args: [address, activeLockupOption],
  //         // gas: BigInt(74000),
  //       })
  //       console.log('contractRes', contractRes)
  //     }
  //   } catch (err) {
  //     // alert('tx failed in catch!')
  //     dispatch(
  //       setSnackbar({
  //         message: 'Transaction failed',
  //         open: true,
  //         severity: 'error',
  //       }),
  //     )
  //     dispatch(setTxInProgress(false))
  //     console.log('catch', err)
  //   } finally {
  //     // setDepositAmount('')
  //   }
  // }, [depositAmount])

  const setAmountWRTPercent = async (percent: number) => {
    // console.clear()

    const rpcUrl = 'https://rpca-vanguard.vanarchain.com'
    const provider = new ethers.providers.JsonRpcProvider(rpcUrl)

    const contract = new ethers.Contract(
      stakingManagerAddress,
      stakingManagerAbi,
      provider,
    )

    const res = await contract.estimateGas.stake(address, activeLockupOption, {
      value: ethers.utils.parseEther(balance),
    })
    const gas = 200000
    console.log('res', res.toString())

    const feeData: any = await provider.getFeeData()

    const gasPriceInEth: number = Number(
      ethers.utils.formatEther(feeData?.gasPrice?.toString()),
    )

    const totalGas = gas * gasPriceInEth

    const amountToStake = Number(balance) - totalGas
    // const gas: number = Number(formattedValue) * 2
    // const amountToStake = Number(balance) - gas
    setDepositAmount(amountToStake.toString())

    // console.log('estimateGas before')
    // if (Number(balance) > 0) {
    //   const amt = BigNumber(balance).div(100).multipliedBy(percent)
    //   console.log('balance')
    //   const floorAmount = Math.floor(Number(amt) * 10) / 10
    //   console.log('floorAmount', floorAmount)

    //   // const amtMinusGas = -1
    //   setDepositAmount(floorAmount.toString() || '')
    // }
  }

  const onStake = async () => {
    console.log('hello')
    try {
      const amount: any = ethers.utils.parseEther(depositAmount)
      /* @ts-ignore */
              const contractRes = writeContract({
              abi: farmingAbi,
              address: farmingContractAddress,
              functionName: 'stake',
              args: [amount],
              gas: BigInt(74000),
            })
    
            console.log('contractRes', contractRes);
    } catch(err) {
      alert('Tx failed')
      console.log('isError', isError)

    }
    finally {

      console.log('data', data);
    }


  }


  const RenderButton = () => {
    if (!address)
      return (
        <WalletButtons
          wallets={[ConnectionType.INJECTED, ConnectionType.WALLET_CONNECT]}
          fullWidth
        />
      )
    else
      return (
        <Button
          variant="contained"
          sx={{
            height: '60px',
            borderRadius: '100px',
            width: '100%',
            marginTop: '15px',
          }}
          onClick={onStake}
          // disabled={!depositAmount}
          // disabled={true}
        >
          Stake
        </Button>
      )
  }

  return (
    <Grid container>
      <InputContainer container minHeight={'140px'}>
        <Grid display={'flex'} justifyContent={'space-between'} width={'100%'}>
          <Typography color={'#F6F6F6'} fontSize={'16px'}>
            Stake Amount
          </Typography>

          <Grid display={'flex'} alignItems={'center'}>
            <img src={VanarToken} height={'18px'} />
            <Typography color={'#FFFFFF'} fontSize={'16px'} marginLeft={'2px'}>
              Toro
            </Typography>
          </Grid>
        </Grid>

        <Grid container alignItems={'center'} justifyContent={'space-between'}>
          <Input
            placeholder="0"
            value={depositAmount}
            onChange={e => {
              const formattedValue = validateAndFormatInput(e.target.value)
              setDepositAmount(formattedValue)
            }}
            onKeyDown={e => {
              if (e.key === 'e' || e.key === '-' || e.key === '+') {
                e.preventDefault()
              }
            }}
            disableUnderline
            type="number"
            sx={{
              width: '100%',
            }}
          />
        </Grid>

        <Grid display={'flex'} justifyContent={'space-between'} width={'100%'}>
          <Typography
            color={'#F6F6F6'}
            fontSize={'16px'}
            sx={{ opacity: '0.5' }}
          >
            Balance:{BigNumber(balance).toFixed(4)}
          </Typography>

          <Grid display={'flex'} alignItems={'center'}>
            <Chip
              label="Max"
              sx={{ cursor: 'pointer' }}
              variant="filled"
              disabled={true}
              onClick={async () => await setAmountWRTPercent(100)}
            />
          </Grid>
        </Grid>
      </InputContainer>

      <Typography
        color={'#F6F6F6'}
        fontSize={'16px'}
        fontWeight={'500'}
        mt={'16px'}
      >
        Locking tokens for a longer time grants a higher share of staking
        rewards and governance rights
      </Typography>

      <Grid container justifyContent={'space-around'} mt={'15px'}>
        <Chip
          label="7D"
          sx={{ cursor: 'pointer', padding: '10px 20px' }}
          variant={activeLockupOption === 0 ? 'filled' : 'outlined'}
          onClick={() => setActiveLockupOption(0)}
        />
        <Chip
          label="30D"
          sx={{ cursor: 'pointer', padding: '10px 20px' }}
          variant={activeLockupOption === 1 ? 'filled' : 'outlined'}
          onClick={() => setActiveLockupOption(1)}
        />
        <Chip
          label="180D"
          sx={{ cursor: 'pointer', padding: '10px 20px' }}
          variant={activeLockupOption === 2 ? 'filled' : 'outlined'}
          onClick={() => setActiveLockupOption(2)}
        />
        <Chip
          label="2Y"
          sx={{ cursor: 'pointer', padding: '10px 20px' }}
          variant={activeLockupOption === 3 ? 'filled' : 'outlined'}
          onClick={() => setActiveLockupOption(3)}
        />
      </Grid>

      {/* {console.log('active lockup option', activeLockupOption)} */}
      <Typography
        color={'#F6F6F6'}
        fontSize={'16px'}
        fontWeight={'700'}
        textAlign={'center'}
        width={'100%'}
        mt={'15px'}
        mb={'15px'}
      >
        Your Reward Multiplier:{' '}
        <span style={{ color: '#03D9AF' }}>
          {activeLockupOption == 0
            ? '10'
            : activeLockupOption == 1
            ? '20'
            : activeLockupOption == 2
            ? '30'
            : '40'}
          %
        </span>
      </Typography>

      <RenderButton />
    </Grid>
  )
}

export default Stake
