import { useCallback, useEffect, useState } from 'react'

import { Button, Chip, Grid, Input, Typography } from '@mui/material'
import { useAppDispatch } from '@hooks/'
import { setTxInProgress } from '@redux/slices/walletSlice'
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
import {
  useAccount,
  useWriteContract,
  useReadContract,
  useChainId,
  useWaitForTransactionReceipt,
} from 'wagmi'
import { getBalance as getBalanceWagmi, createConfig, http } from '@wagmi/core'
import { bscTestnet } from 'viem/chains'
import { config } from './configuration'
import ProgressBar from '@components/ProgressBar'
import { farmingAbi, farmingContractAddress } from './contract'

const Reward = () => {
  const [depositAmt, setDepositAmt] = useState('')
  const [error, setError] = useState('')
  const [disableClaimButton, setDisableClaimButton] = useState(true)
  const [balance, setBalance] = useState('0')

  const { address, isConnecting, isDisconnected, isConnected } = useAccount()
  const chainId = useChainId()

  const {
    writeContract,
    data,
    isError,
    writeContractAsync,
    isPending,
    isSuccess,
  } = useWriteContract()

  // const vanarChain = chainConfig['78600']

  /* @ts-ignore */
  // const config = createConfig({
  //   chains: [vanarChain, bscTestnet],
  //   transports: {
  //     [vanarChain.id]: http(),
  //     [bscTestnet.id]: http(),
  //   },
  // })

  const [boostedPoolBalance, setBoostedPoolBalance] = useState('0')

  const contractsAndAbis = chainIdToContracts[chainId]
  const {
    stakingManagerAbi = '',
    stakingManagerAddress = '',
    BoostPoolAddress = '',
    StakingDatabaseAddress = '',
    stakingDatabaseAbi = '',
  } = contractsAndAbis ?? {}

  const getBalanceFromWagmi = async () => {
    if (address) {
      const balanceWagmi = await getBalanceWagmi(config, {
        address: BoostPoolAddress,
        blockTag: 'latest',
      })
      const { value, decimals } = balanceWagmi
      const formattedValue = ethers.utils.formatEther(value)
      console.log('Balance From Wagmi 3', formattedValue)
      setBoostedPoolBalance(formattedValue)
      return formattedValue
    }
  }

  useEffect(() => {
    getBalanceFromWagmi()
  }, [])

  /* @ts-ignore */
  const res: any = useReadContract({
    abi: stakingDatabaseAbi,
    address: StakingDatabaseAddress,
    functionName: 'getUserDetailsForReward',
    args: [address?.toLowerCase() as `0x${string}`],
  })

  const { refetch: getUserDetailsForRewardRefetch } = res
  const [timeToUnstake, setTimeToUnstake]: any = useState('')
  function addDays(theDate: any, days: any) {
    return new Date(theDate.getTime() + days * 24 * 60 * 60 * 1000)
  }

  /* @ts-ignore */
  const userDetails: any = useReadContract({
    abi: stakingDatabaseAbi,
    address: StakingDatabaseAddress,
    functionName: 'getUserDetails',
    args: [address?.toLowerCase() as `0x${string}`],
  })

  const [currentTimeStamp, setCurrentTimeStamp] = useState(0)
  const [totalDuration, setTotalDuration] = useState(0) 
  const [lastTimeStampInSeconds, setLastTimeStampInSeconds] = useState(0)

  useEffect(() => {
    console.log('time to stake update kr dena', userDetails?.data)
    if (userDetails?.data && userDetails?.data[1].length > 0) {
      console.log('time to stake iff k andar')
      const timestamps = userDetails?.data[1]
      const lastTimeStamp: any = timestamps[timestamps.length - 1]
      const fourteenDaysTimeStamp = 1209600 // This number is in seconds which represents 14 days cooldown period

      const date = new Date(Number(lastTimeStamp) * 1000)

      const lastTimeStampInSeconds = date.getTime() / 1000
      const currentTimeStamp = Math.floor(Date.now() / 1000)
      const timeToUnstake = addDays(date, 14)
      setCurrentTimeStamp(currentTimeStamp)
      setTotalDuration(lastTimeStampInSeconds + fourteenDaysTimeStamp)
      setLastTimeStampInSeconds(lastTimeStampInSeconds)
      

      if (currentTimeStamp < lastTimeStampInSeconds + fourteenDaysTimeStamp) {
        console.log('less than 14 days')
        setTimeToUnstake(timeToUnstake.toLocaleString())

        setDisableClaimButton(true)
      } else {
        // alert('can unstake')
        setDisableClaimButton(false)
      }
    } else {
      setTimeToUnstake('')
    }
  }, [userDetails?.data])

  useEffect(() => {
    ;(async () => {
      totalShareRefetch()
      getUserDetailsForRewardRefetch()

      const rewardAmount = await getRewardAmount2()
      console.log('reward amount', rewardAmount)
      setBalance(rewardAmount.toString())
    })()
  }, [address])

  const totalAmount =
    res?.isLoading == false &&
    ethers.utils.formatEther(res?.data?.[0]?.toString() ?? '0')
  console.log('total amount', totalAmount)

  const poolShare =
    res?.isLoading == false &&
    ethers.utils.formatEther(res?.data?.[1]?.toString() ?? '0')
  console.log('poolShare', poolShare)

  const totalReward =
    res?.isLoading == false &&
    ethers.utils.formatEther(res?.data?.[2]?.toString() ?? '0')
  console.log('totalReward', totalReward)

  /* @ts-ignore */
  const totalShareDetails: any = useReadContract({
    abi: stakingDatabaseAbi,
    address: StakingDatabaseAddress,
    functionName: 'totalShare',
  })

  const { refetch: totalShareRefetch } = totalShareDetails

  const totalShare =
    totalShareDetails?.isLoading == false &&
    ethers.utils.formatEther(totalShareDetails?.data?.toString() ?? '0')
  console.log('totalShare', totalShare)

  useEffect(() => {
    console.log('res data changed', res)
  }, [res])

  const getRewardAmount2 = async () => {
    console.log('loading get reward 2', { poolShare, totalShare, totalReward })
    const res: number =
      Number(totalShare) > 0
        ? (Number(poolShare) / Number(totalShare)) * Number(totalReward)
        : 0
    console.log('getRewardAmount2 res', res)
    const result = (Number(res) + Number(totalAmount)) * 0.02
    console.log('getRewardAmount2 result', result, totalAmount)
    // return result;

    if (Number('result') > Number(boostedPoolBalance)) {
      console.log('getRewardAmount2 iff k andar')

      // alert('error insufficient funds')
      setDisableClaimButton(true)

      dispatch(
        setSnackbar({
          message: 'Insufficient Balance',
          open: true,
          severity: 'error',
        }),
      )

      throw 'Insufficient funds!'
    } else {
      return result
    }
    return res
  }

  useEffect(() => {
    console.log('balance wala useeffe 1', address, chainId)
    ;(async () => {
      if (
        !address ||
        (chainId !== SupportedChainId.VANAR_TESTNET &&
          chainId !== SupportedChainId.GOERLI &&
          chainId !== SupportedChainId.HARDHAT_NETWORK &&
          chainId !== SupportedChainId.SEPOLIA &&
          chainId !== SupportedChainId.BSC)
      ) {
        return
      }

      try {
        const rewardAmount = await getRewardAmount2()
        console.log('reward amount', rewardAmount)
        setBalance(rewardAmount.toString())
      } catch (err) {
        console.log('in error', err)
      }
    })()
  }, [address, res, totalShare])

  const dispatch = useAppDispatch()

  const {
    status,
    isSuccess: isTxSuccess,
    isError: isTxError,
    data: txData,
  } = useWaitForTransactionReceipt({ hash: data })
  console.log('useWaitForTransactionReceipt', txData)

  useEffect(() => {
    ;(async () => {
      if (isTxSuccess) {
        // console.clear()
        console.log('balance wala useeff 2')
        console.log(
          'got confirmations tx receipt wala use effect ',
          isTxSuccess,
        )
        // alert('refetch kro')
        totalShareRefetch()
        getUserDetailsForRewardRefetch()

        const rewardAmount = await getRewardAmount2()
        console.log('reward amount', rewardAmount)
        setBalance(rewardAmount.toString())
        console.log('tx loader false in useeffe')
        dispatch(setTxInProgress(false))
        dispatch(
          setSnackbar({
            message: 'Transaction successful',
            open: true,
            severity: 'success',
          }),
        )
      }
    })()
  }, [isTxSuccess])

  const onRewardClaim = () => {
    
    /* @ts-ignore */
const contractRes = writeContract({
  abi: farmingAbi,
  address: farmingContractAddress,
  functionName: 'claimReward',
  gas: BigInt(74000),
})
console.log('contract res', contractRes);
}


  const onStake = useCallback(async () => {
    try {
      if (address) {
        dispatch(setTxInProgress(true))

        /* @ts-ignore */
        const res = await writeContractAsync({
          abi: stakingManagerAbi,
          address: stakingManagerAddress,
          functionName: 'claimReward',
          // gas: BigInt(210000),
          // args: [BigInt(amount)],
        })
      }
    } catch (err) {
      console.log('tx loader false in catch', err)
      dispatch(setTxInProgress(false))
    }
  }, [depositAmt])

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
          onClick={onRewardClaim}
          // onClick={onStake}
          // disabled={disableClaimButton}
          // disabled={true}
        >
          Claim
        </Button>
      )
  }

  const [activeLockupOption, setActiveLockupOption] = useState(5)

  return (
    <Grid container>
      <InputContainer container minHeight={'140px'}>
        <Grid display={'flex'} justifyContent={'space-between'} width={'100%'}>
          <Typography color={'#F6F6F6'} fontSize={'16px'}>
            Claim Rewards
          </Typography>

          <Grid display={'flex'} alignItems={'center'}>
            <img src={VanarToken} height={'18px'} />
            <Typography color={'#FFFFFF'} fontSize={'16px'} marginLeft={'2px'}>
              Toro
            </Typography>
          </Grid>
        </Grid>

        {/* <Grid container alignItems={'center'} justifyContent={'space-between'}>
          <Input
            placeholder="0"
            value={depositAmt}
            onChange={e => setDepositAmt(e.target.value)}
            disableUnderline
            type="number"
            sx={{
              width: '100%',
            }}
          />
        </Grid> */}

        {/* <Grid display={'flex'} justifyContent={'space-between'} width={'100%'}> */}
          {/* <Typography
            color={'#F6F6F6'}
            fontSize={'16px'}
            sx={{ opacity: '0.5' }}
          >
            Balance:{BigNumber(balance).toFixed(8)}
          </Typography> */}

          {/* <Grid display={'flex'} alignItems={'center'}>
            <Chip
              label="Max"
              sx={{ cursor: 'pointer' }}
              variant="filled"
              onClick={() => setAmountWRTPercent(100)}
            />
          </Grid> */}
        {/* </Grid> */}
      </InputContainer>

        {console.log('check reward', timeToUnstake)}
      {timeToUnstake && <ProgressBar lastTimeStampInSeconds={lastTimeStampInSeconds} currentTimeStamp={currentTimeStamp} totalDuration={totalDuration} />}
      {timeToUnstake && (
        <Typography
          color={disableClaimButton ? 'red' : '#03D9AF'}
          fontSize={'16px'}
          fontWeight={'500'}
          mt={'16px'}
          mb={'16px'}
        >
          Unstake Time: {timeToUnstake}
        </Typography>
      )}

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
        disabled={Number(balance) < 0.0001 ? true : false}
        // disabled={!depositAmt}
      >
        Claim
      </Button> */}
    </Grid>
  )
}

export default Reward
