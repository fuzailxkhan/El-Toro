import { useCallback, useEffect, useState } from 'react'
import {
  DetailContainer,
  InputContainer,
  LockupOptionChip,
  StakingContainer,
} from './styles'
import { Button, Chip, Grid, Input, Typography } from '@mui/material'
// import { useAppDispatch, useStakingManager } from '@hooks/'
import { setTxInProgress } from '@redux/slices/walletSlice'
import { setSnackbar } from '@redux/slices/themeSlice'
import { useWeb3React } from '@web3-react/core'
import { ethers } from 'ethers'
import BigNumber from 'bignumber.js'
import { SupportedChainId } from '../../constants/chains'
import TabsComponent from './tabs'
import { VanarToken } from '@assets/index'
import Stake from '@components/StakingTabs/stake'
import Reward from '@components/StakingTabs/reward'
import Unstake from '@components/StakingTabs/unstake'

const StakingTab = () => {
  const [depositAmt, setDepositAmt] = useState('')
  const [error, setError] = useState('')

  const [balance, setBalance] = useState('0')

  const { provider, account, chainId } = useWeb3React()

  useEffect(() => {
    ;(async () => {
      if (
        !account ||
        (chainId !== SupportedChainId.VANAR_TESTNET &&
          chainId !== SupportedChainId.GOERLI &&
          chainId !== SupportedChainId.HARDHAT_NETWORK &&
          chainId !== SupportedChainId.SEPOLIA && 
          chainId !== SupportedChainId.BSC)
      ) {
        return
      }

      // get balance

      await getBalance()
    })()
  }, [provider, account])

  const getBalance = async () => {
    if (provider && account) {
      console.log(provider, '===>', account, 'pro and acc')
      let balance: any = await provider.getBalance(account)

      balance = ethers.utils.formatEther(balance.toString())
      balance = BigNumber(balance).toString()
      setBalance(balance)
    }
  }

  const [tab, setTab] = useState(0)

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTab(newValue)
  }

  const renderStakingTab = () => {
    if (tab === 0) return <Stake />
    else if (tab === 1) return <Reward />
    else return <Unstake />
  }

  return (
    // <Grid container xs={10} md={3.5}>
    //   <Grid container>
    //     <Typography variant="h4" marginTop={4}>
    //       Enter Amount
    //     </Typography>
    //   </Grid>

    //   <Grid
    //     container
    //     flexDirection={'column'}
    //     height={'56px'}
    //     border={'1px solid white'}
    //     borderRadius={'80px'}
    //     marginTop={1}
    //     padding={'4px 24px'}
    //     justifyContent={'center'}
    //   >
    //     <Grid container alignItems={'center'} justifyContent={'space-between'}>
    //       <Input
    //         placeholder="TVK Token Amount"
    //         value={depositAmt}
    //         onChange={e => setDepositAmt(e.target.value)}
    //         disableUnderline
    //         type="number"
    //         sx={{
    //           width: '100%',
    //         }}
    //       />
    //     </Grid>
    //   </Grid>

    //   <Grid
    //     container
    //     flexDirection={'row'}
    //     justifyContent={'space-between'}
    //     marginTop={2}
    //   >
    //     <Grid container xs={12} md={8}>
    //       <Chip
    //         label="25%"
    //         sx={{ cursor: 'pointer', marginLeft: '8px' }}
    //         variant="filled"
    //         onClick={() => setAmountWRTPercent(25)}
    //       />
    //       <Chip
    //         label="50%"
    //         sx={{ cursor: 'pointer', marginLeft: '8px' }}
    //         variant="filled"
    //         onClick={() => setAmountWRTPercent(50)}
    //       />
    //       <Chip
    //         label="75%"
    //         sx={{ cursor: 'pointer', marginLeft: '8px' }}
    //         variant="filled"
    //         onClick={() => setAmountWRTPercent(75)}
    //       />
    //       <Chip
    //         label="100%"
    //         sx={{ cursor: 'pointer', marginLeft: '8px' }}
    //         variant="filled"
    //         onClick={() => setAmountWRTPercent(100)}
    //       />
    //     </Grid>

    //     <Grid container xs={12} md={4} justifyContent={'flex-end'}>
    //       <Typography variant="h4">
    //         Balance: {BigNumber(balance).toFixed(4)}
    //       </Typography>
    //     </Grid>
    //   </Grid>

    //   <Grid container>
    //     <Typography variant="h4" marginTop={4}>
    //       Select Lockup Period
    //     </Typography>
    //   </Grid>

    //   <Grid container justifyContent={'space-between'} marginTop={2}>
    //     <LockupOptionChip
    //       active={activeLockupOption === 0}
    //       xs={2.5}
    //       onClick={() => setActiveLockupOption(0)}
    //     >
    //       <Typography variant="h6">7 days</Typography>
    //     </LockupOptionChip>

    //     <LockupOptionChip
    //       active={activeLockupOption === 1}
    //       xs={2.5}
    //       onClick={() => setActiveLockupOption(1)}
    //     >
    //       <Typography variant="h6">30 days</Typography>
    //     </LockupOptionChip>

    //     <LockupOptionChip
    //       active={activeLockupOption === 2}
    //       xs={2.5}
    //       onClick={() => setActiveLockupOption(2)}
    //     >
    //       <Typography variant="h6">180 days</Typography>
    //     </LockupOptionChip>

    //     <LockupOptionChip
    //       active={activeLockupOption === 3}
    //       xs={2.5}
    //       onClick={() => setActiveLockupOption(3)}
    //     >
    //       <Typography variant="h6">2 years</Typography>
    //     </LockupOptionChip>
    //   </Grid>

    //   <Grid container marginTop={4}>
    //     <Typography variant="h2" fontWeight={700}>
    //       Lockup Multiplier:
    //     </Typography>
    //     <Typography
    //       variant="h2"
    //       marginLeft={2}
    //       fontWeight={700}
    //       color={'primary.contrastText'}
    //     >
    //       {lockupMultiplier}%
    //     </Typography>
    //   </Grid>

    //   <Grid container flexDirection={'column'} marginTop={4}>
    //     <Button
    //       variant="contained"
    //       sx={{ height: '55px', borderRadius: '14px' }}
    //       onClick={onStake}
    //       disabled={!depositAmt}
    //     >
    //       Stake
    //     </Button>
    //   </Grid>
    // </Grid>
    <Grid container xs={10} md={3.5}>
      <Grid
        container
        flexDirection={'column'}
        justifyContent={'center'}
        alignItems={'center'}
        gap={'12px'}
        mt={'50px'}
      >
        <Typography fontSize={'40px'} fontWeight={'600'} color={'#F6F6F6'}>
          Stake VANRY
        </Typography>
        <Typography
          fontSize={'16px'}
          fontWeight={'500'}
          color={'#F6F6F6'}
          sx={{ opacity: '0.7' }}
        >
          Select how much VANRY you want to stake  
        </Typography>
      </Grid>

      <StakingContainer mt={'24px'} minHeight={'516px'} container>
        <TabsComponent
          value={tab}
          setValue={setTab}
          handleChange={handleTabChange}
          tabNames={[
            { name: 'Stake' },
            { name: 'Reward' }, // Disabled tab
            { name: 'Unstake' },
          ]}
          xsValue={12}
          mdValue={12}
        />

        {renderStakingTab()}
      </StakingContainer>
    </Grid>
  )
}

export default StakingTab
