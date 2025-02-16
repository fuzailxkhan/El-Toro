import { useCallback, useEffect, useState } from 'react'

import { Button, Chip, Grid, Input, Typography } from '@mui/material'
import { useAppDispatch } from '@hooks/'
import {
  setAvailableContracts,
  setTxInProgress,
} from '@redux/slices/walletSlice'
import { setSnackbar } from '@redux/slices/themeSlice'
// import { useWeb3React } from '@web3-react/core'
import { ethers } from 'ethers'
import BigNumber from 'bignumber.js'
import {
  SupportedChainId,
  chainConfig,
  chainIdToContracts,
} from '../../constants/chains'
import { VanarToken } from '@assets/index'
import { StakingContainer, InputContainer } from '@pages/Home/styles'
import { validateAndFormatInput } from '@utils/index'
import { ChainContracts } from '../../hooks/useContract/types'
import WalletButtons from '@components/WalletButtons'
import { ConnectionType } from '../../connection'
import {
  useAccount,
  useSimulateContract,
  useWriteContract,
  useReadContract,
  useChainId,
  useTransactionConfirmations,
  useWaitForTransactionReceipt,
} from 'wagmi'
import { simulateContract, http, createConfig } from '@wagmi/core'
import { bscTestnet } from 'viem/chains'
import { config } from './configuration'
import ProgressBar from '@components/ProgressBar'
import { farmingAbi, farmingContractAddress } from './contract'

// import { StakingDatabaseAddress, stakingDatabaseAbi, stakingManagerAbi, stakingManagerAddress } from '../../constants/contracts'

const Unstake = () => {
  const [withdrawAmount, setWithdrawAmount] = useState('')
  const [error, setError] = useState('')
  const {
    writeContract,
    data,
    isError,
    writeContractAsync,
    isPending,
    isSuccess,
  } = useWriteContract()

  const [balance, setBalance] = useState('0')

  const dispatch = useAppDispatch()

  const chainId = useChainId()

  const { address, isConnecting, isDisconnected, isConnected } = useAccount()

  const contractsAndAbis = chainIdToContracts[chainId]
  const {
    stakingManagerAbi = '',
    stakingManagerAddress = '',
    StakingDatabaseAddress = '',
    stakingDatabaseAbi = '',
  } = contractsAndAbis ?? {}

  /* @ts-ignore */
  const { refetch: refetchStakedAmount, data: stakedAmount } = useReadContract({
    abi: farmingAbi,
    address: farmingContractAddress,
    functionName: 'stakedAmounts',
    args: [address?.toLowerCase() as `0x${string}`],
  })

  /* @ts-ignore */
  const res: any = useReadContract({
    abi: stakingDatabaseAbi,
    address: StakingDatabaseAddress,
    functionName: 'userDetails',
    args: [address?.toLowerCase() as `0x${string}`],
  })

  /* @ts-ignore */
  const userDetailsForReward = useReadContract({
    abi: stakingDatabaseAbi,
    address: StakingDatabaseAddress,
    functionName: 'getUserDetailsForReward',
    args: [address?.toLowerCase() as `0x${string}`],
  })

  /* @ts-ignore */
  const userDetails: any = useReadContract({
    abi: stakingDatabaseAbi,
    address: StakingDatabaseAddress,
    functionName: 'getUserDetails',
    args: [address?.toLowerCase() as `0x${string}`],
  })



  const [disableButton, setDisableButton] = useState(true)

  console.log('user details all', userDetails?.data)

  const { refetch } = res
  const { refetch : refetchForUserDetails } = userDetails;

  // console.log('userDetailsForReward', userDetailsForReward)

  console.log('is success running ab11 staked amount 1', res?.data)

  const {
    status,
    isSuccess: isTxSuccess,
    isError: isTxError,
  } = useWaitForTransactionReceipt({ hash: data })
  console.log('confirmations', isTxError, status)

  function addDays(theDate: any, days: any) {
    return new Date(theDate.getTime() + days*24*60*60*1000);
}

  const[timeToUnstake, setTimeToUnstake]: any = useState('')

  useEffect(() => {
    // console.log('user details here', userDetails?.data, userDetails?.data[1])
    if (userDetails?.data && userDetails?.data[1].length > 0) {
  
      const timestamps = userDetails?.data[1]
      const lastTimeStamp: any = timestamps[timestamps.length - 1]
      const fourteenDaysTimeStamp = 1209600 // This number is in seconds which represents 14 days cooldown period
   
      const date = new Date(Number(lastTimeStamp) * 1000)
   
      const lastTimeStampInSeconds = date.getTime() / 1000
      const currentTimeStamp = Math.floor(Date.now() / 1000)
      const timeToUnstake = addDays(date, 14)
      console.log('time to unstake', timeToUnstake)
      if(currentTimeStamp < lastTimeStampInSeconds + fourteenDaysTimeStamp) {
        setTimeToUnstake(timeToUnstake.toLocaleString())
      
        console.log('less than 14 days')
        setDisableButton(true)
        
      } else {
        // alert('can unstake')
        setDisableButton(false)
      }
    
    }
    else {
      setTimeToUnstake('')
    }
  }, [userDetails?.data])

  useEffect(() => {
    refetch()
    refetchForUserDetails()
    const stakedAmount = ethers.utils.formatEther(res?.data?.[0] ?? '0')
    // console.log('ab13 staked amount 2', stakedAmount)
    setBalance(stakedAmount)
  }, [address])

  useEffect(() => {
    console.log('isTxSuccess wala use effe', { isTxSuccess, isError })
    if (isError || isTxError) {
      // alert('Error aya')
      dispatch(setTxInProgress(false))
      dispatch(
        setSnackbar({
          message: 'Transaction failed',
          open: true,
          severity: 'error',
        }),
      )
    }
    if (isTxSuccess) {
      refetch()
      refetchStakedAmount();
      dispatch(setTxInProgress(false))
      dispatch(
        setSnackbar({
          message: 'Transaction successful',
          open: true,
          severity: 'success',
        }),
      )
    }

    // refetch()
  }, [isTxSuccess, isError])

  console.log('vanar config here', chainId, chainConfig[chainId])

  useEffect(() => {
    console.log('ab12 account changed', address)
    ;(async () => {
      if (
        !address ||
        (chainId !== SupportedChainId.VANAR_TESTNET &&
          chainId !== SupportedChainId.GOERLI &&
          chainId !== SupportedChainId.HARDHAT_NETWORK &&
          chainId !== SupportedChainId.SEPOLIA &&
          chainId !== SupportedChainId.BSC)
      ) {
        let _chainId: '5' | '78600' | '31337' | '11155111' | '97' =
          chainId as any
        dispatch(setAvailableContracts(ChainContracts[_chainId]))
        console.log('ab1 chalo return kro')
        return
      } else console.log('else chala')

      // get balance
      // const stakedAmount = await getStakedAmount(account)
      // console.log('staked amount', stakedAmount)
      // console.log('ab14 res', res?.data?.[0])
      // console.log('ab14 res', res?.data)
      const stakedAmount = ethers.utils.formatEther(res?.data?.[0] ?? '0')
      // console.log('ab13 staked amount 2', stakedAmount)
      setBalance(stakedAmount)
      // await getBalance()
    })()
  }, [address, res])

  // const vanarChain = chainConfig['78600']

  // /* @ts-ignore */
  // const config = createConfig({
  //   chains: [vanarChain, bscTestnet],
  //   transports: {
  //     [vanarChain.id]: http(),
  //     [bscTestnet.id]: http(),
  //   },
  // })

  console.log('values', { isError, data, isPending, isSuccess })

  const onWithDraw = () => {
    console.log('withdraw amount', withdrawAmount)
    const amount: any = ethers.utils.parseEther(withdrawAmount)

    /* @ts-ignore */
    const contractRes = writeContract({
      abi: farmingAbi,
      address: farmingContractAddress,
      functionName: 'unstake',
      args: [amount],
      gas: BigInt(74000),
      })
      console.log('contract res', contractRes); 
  }

  const onStake = useCallback(async () => {
    try {
      if (withdrawAmount > balance) {
        dispatch(
          setSnackbar({
            message: 'Insufficient Balance',
            open: true,
            severity: 'error',
          }),
        )

        return
      }
      // console.clear()

      dispatch(setTxInProgress(true))

      console.log('amount', withdrawAmount)
      // ok conversion logic
      const amount: any = ethers.utils.parseEther(withdrawAmount)
      console.log('testOnStake working [][]', amount)
      console.log('address', address)

      console.log('res', res)

      if (address) {
        /* @ts-ignore */
        writeContractAsync({
          // value: amount,
          abi: stakingManagerAbi,
          address: stakingManagerAddress,
          functionName: 'unstake',
          args: [amount],
        })
      }
    } catch (err) {
      console.log('error here', err)
      // alert('tx failed in catch!')
      dispatch(
        setSnackbar({
          message: 'Transaction failed',
          open: true,
          severity: 'error',
        }),
      )

      dispatch(setTxInProgress(false))
    } finally {
      console.log('finally')
    }
  }, [withdrawAmount])

  const setAmountWRTPercent = (percent: number) => {
    if (Number(balance) > 0) {
      const amt = BigNumber(balance).div(100).multipliedBy(percent)

      setWithdrawAmount(amt.toString() || '')
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
            marginTop: '50px',
          }}
          onClick={onWithDraw}
          // disabled={true}
          // disabled={disableButton}
        >
          Withdraw
        </Button>
      )
  }

  return (
    <Grid container>
      <InputContainer container minHeight={'140px'}>
        <Grid display={'flex'} justifyContent={'space-between'} width={'100%'}>
          <Typography color={'#F6F6F6'} fontSize={'16px'}>
            Unstake Amount
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
            value={withdrawAmount}
            onChange={e => {
              const formattedValue = validateAndFormatInput(e.target.value)
              setWithdrawAmount(formattedValue)
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
            {/* Balance:{BigNumber(balance).toFixed(4)} */}
            {stakedAmount && ethers.utils.formatEther(stakedAmount.toString())}
        
          </Typography>

          <Grid display={'flex'} alignItems={'center'}>
            <Chip
              label="Max"
              sx={{ cursor: 'pointer' }}
              variant="filled"
              disabled={disableButton}
              onClick={() => setAmountWRTPercent(100)}
            />
          </Grid>
        </Grid> 
      </InputContainer>
      {timeToUnstake && <ProgressBar timeToUnstake={timeToUnstake} />}
      
      {timeToUnstake && <Typography
        color={disableButton ? 'red' : '#03D9AF'}
        fontSize={'16px'}
        fontWeight={'500'}
        mt={'16px'}
        mb={'16px'}
      >
       Unstake Time: {timeToUnstake}
      </Typography>}

      {/* <Typography
        color={'#F6F6F6'}
        fontSize={'16px'}
        fontWeight={'500'}
        mt={'16px'}
        mb={'16px'}
      >
        X% fee is applied when you claim rewards. If you claim before your
        locked in period is over, you will pay an additional X fee.
      </Typography> */}

      <RenderButton />

      {/* <Button
        variant="contained"
        sx={{
          height: '60px',
          borderRadius: '100px',
          width: '100%',
          marginTop: '50px',
        }}
        onClick={onStake}
        disabled={!withdrawAmount}
      >
        Withdraw
      </Button> */}
    </Grid>
  )
}

export default Unstake
