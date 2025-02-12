// import { Depositor } from '@contracts/types'
// import useContract from '../../hooks/useContract'
// import { AvailableContracts } from '../../hooks/useContract/types'
import React, { useCallback, useEffect, useState } from 'react'
import { Container, DetailContainer } from './styles'
import { BitTokenIcon, Logo } from '../../assets'
import { Button, Chip, Grid, Input, Typography } from '@mui/material'
import { ContainedButton } from '@components/Buttons/ContainedButton'

import {
  useAppDispatch,
  useAppSelector,
  // useStakingDatabase,
  // useStakingManager,
} from '@hooks/'
import { setSnackbar } from '@redux/slices/themeSlice'
import { useWeb3React } from '@web3-react/core'
import { ethers } from 'ethers'
import BigNumber from 'bignumber.js'
import { setTxInProgress } from '@redux/slices/walletSlice'
import { SupportedChainId } from '../../constants/chains'

const GovernanceTab = () => {
  const [unstakeAmount, setUnstakeAmount] = useState('')
  const [error, setError] = useState('')

  // const { userDetails } = useStakingDatabase()
  // const { unstake } = useStakingManager()
  const { account, chainId } = useWeb3React()

  const availableContracts = useAppSelector(
    state => state.wallet.availableContracts,
  )

  const [stakedAmount, setStakedAmount] = useState('')

  // useEffect(() => {
  //   ;(async () => {
  //     if (
  //       !account ||
  //       !availableContracts ||
  //       (chainId !== SupportedChainId.GOERLI &&
  //         chainId !== SupportedChainId.VANAR_TESTNET &&
  //         chainId !== SupportedChainId.SEPOLIA )
  //     ) {
  //       return
  //     }
  //     // get balance
  //     await getStakedAmount()
  //   })()
  // }, [account])

  // const getStakedAmount = useCallback(async () => {
  //   if (account) {
  //     let details: any = await userDetails(account)
  //     if (!details) return

  //     console.log('details are ', {
  //       totalAmount: ethers.utils.formatEther(details?.totalAmount.toString()),
  //       poolShare: ethers.utils.formatEther(details?.poolShare.toString()),
  //     })

  //     details = ethers.utils.formatEther(details?.totalAmount.toString())

  //     setStakedAmount(details || '0')
  //   }
  // }, [userDetails, availableContracts])

  const dispatch = useAppDispatch()
  const onUnstake = useCallback(async () => {
    console.log('unstake amount is ', {
      unstakeAmount,
      stakedAmount,
    })

    if (unstakeAmount > stakedAmount) {
      dispatch(
        setSnackbar({
          message: 'Not enough staked amount',
          open: true,
          severity: 'error',
        }),
      )

      return
    }
    dispatch(setTxInProgress(true))
    try {
      console.log('amount => ', unstakeAmount)
      // let response = await unstake(unstakeAmount)

      // console.log('response is ', response)

      // if (response) {
      //   // await getStakedAmount()
      //   dispatch(
      //     setSnackbar({
      //       message: `${unstakeAmount} TVK unstaked Successfully`,
      //       open: true,
      //       severity: 'success',
      //     }),
      //   )
      // }
    } catch (e: any) {
      console.log('error is ', JSON.stringify(e))
      dispatch(
        setSnackbar({
          message:
            e?.code === 'ACTION_REJECTED'
              ? 'User rejected transaction.'
              : 'Something went wrong.',
          open: true,
          severity: 'error',
        }),
      )
    } finally {
      dispatch(setTxInProgress(false))
      setUnstakeAmount('')
    }
  }, [unstakeAmount])

  const onApprove = useCallback(async () => {}, [unstakeAmount])

  return (
    <>
      <Grid container>
        <Typography variant="h4" marginTop={4}>
          Claimable Amount
        </Typography>
      </Grid>

      <Grid
        container
        flexDirection={'column'}
        height={'56px'}
        border={'1px solid white'}
        borderRadius={'80px'}
        marginTop={1}
        padding={'4px 24px'}
        justifyContent={'center'}
      >
        <Grid container alignItems={'center'} justifyContent={'space-between'}>
          <Input
            placeholder="TVK Token Amount"
            value={unstakeAmount}
            onChange={e => setUnstakeAmount(e.target.value)}
            disableUnderline
            type="number"
            sx={{
              width: '100%',
            }}
          />
        </Grid>
      </Grid>

      <DetailContainer container marginTop={4}>
        <Grid container justifyContent={'space-between'}>
          <Typography variant="h5">Your Staked Amount</Typography>
          <Typography variant="h5">{stakedAmount}</Typography>
        </Grid>
      </DetailContainer>

      <Grid container flexDirection={'column'} marginTop={4}>
        <Button
          variant="contained"
          sx={{ height: '55px', borderRadius: '14px' }}
          onClick={onUnstake}
          disabled={!unstakeAmount}
        >
          Unstake
        </Button>
      </Grid>
    </>
  )
}

export default GovernanceTab
