import { Grid, Typography } from '@mui/material'
import { StatsBox, StatsBoxLarge } from './styles'
import { APY, Indicator, StakingIcon, VanarToken } from '@assets/index'
import axios from 'axios'
import { useEffect, useState } from 'react'
import CircularProgress from '@mui/material/CircularProgress'
import { formatNumber } from '@utils/index'
import { SERVER_URL } from '../../constants/application'
import {
  useReadContract,
} from 'wagmi'
import { stakingManagerAbi, stakingManagerAddress } from '../../constants/contracts'
import { ethers } from 'ethers'

const StatsTab = () => {

    /* @ts-ignore */
    const res: any = useReadContract({
      abi: stakingManagerAbi,
      address: stakingManagerAddress,
      functionName: 'totalStakedAmount',
    })

  const stakedAmount = ethers.utils.formatEther(res?.data ?? '0')
  

  interface ITokenDetails {
    totalSupply: number
    circulatingSupply: number
    price: number
    marketCap: number
    priceChangeIn24Hr: number
  }

  const [tokenDetails, setTokenDetails] = useState<ITokenDetails>({
    totalSupply: 0,
    circulatingSupply: 0,
    price: 0,
    marketCap: 0,
    priceChangeIn24Hr: 0,
  })
 
  const [showLoader, setShowLoader] = useState(true)      

  const fetchTokenDetails = async () => {
    try {
      console.log('server url', SERVER_URL)
      const res = await axios.get(`${SERVER_URL}/getTokenDetails`)
      console.log('res', res?.data?.data?.VANRY)
      setTokenDetails({
        circulatingSupply: res?.data?.data?.VANRY?.circulating_supply,
        totalSupply: res?.data?.data?.VANRY?.total_supply,
        price: res?.data?.data?.VANRY?.quote?.USD?.price,
        marketCap: res?.data?.data?.VANRY?.self_reported_market_cap,
        priceChangeIn24Hr:
          res?.data?.data?.VANRY?.quote?.USD?.percent_change_24h,
      })
      setShowLoader(false)
    } catch (err) {
      setShowLoader(false)
      alert('An error occurred')
    }
  }

  useEffect(() => {
    fetchTokenDetails()
  }, [])

  return (
    <Grid container xs={10} md={11}>
      <Grid
        container
        flexDirection={'column'}
        justifyContent={'center'}
        alignItems={'center'}
        gap={'12px'}
        mt={'50px'}
      >
        <Typography fontSize={'40px'} fontWeight={'600'} color={'#F6F6F6'}>
          Statistics
        </Typography>
        <Typography
          fontSize={'16px'}
          fontWeight={'500'}
          color={'#F6F6F6'}
          sx={{ opacity: '0.7' }}
        >
          ABC token ecosystem statistics  
        </Typography>
      </Grid>

      <Grid
        container
        flexDirection={'row'}
        justifyContent={'space-between'}
        alignItems={'center'}
        mt={'20px'}
      >
        <StatsBox md={2.8} xs={12}>
          <Grid container marginBottom={'12px'}>
            <img src={VanarToken} height={'24px'} />
            <Typography fontSize={'16px'} color={'#F6F6F6'} marginLeft={0.5}>
              Total ABC supply
            </Typography>
          </Grid>
          <Grid>
            <Typography fontSize={'36px'} fontWeight={'600'} color={'#F6F6F6'}>
              {showLoader ? (
                <CircularProgress />
              ) : (
                formatNumber(tokenDetails?.totalSupply)
              )}
            </Typography>
          </Grid>
        </StatsBox>

        <StatsBox md={2.8} xs={12}>
          <Grid container marginBottom={'12px'}>
            <img src={VanarToken} height={'24px'} />
            <Typography fontSize={'16px'} color={'#F6F6F6'} marginLeft={0.5}>
              ABC in circulation
            </Typography>
          </Grid>
          <Grid>
            <Typography fontSize={'36px'} fontWeight={'600'} color={'#F6F6F6'}>
              {showLoader ? (
                <CircularProgress />
              ) : (
                formatNumber(tokenDetails?.circulatingSupply)
              )}
            </Typography>
          </Grid>
        </StatsBox>

        <StatsBox md={2.8} xs={12}>
          <Grid container marginBottom={'12px'}>
            <img src={VanarToken} height={'24px'} />
            <Typography fontSize={'16px'} color={'#F6F6F6'} marginLeft={0.5}>
              ABC Price
            </Typography>
          </Grid>
          <Grid container justifyContent={'flex-start'} alignItems={'baseline'}>
            <Typography
              fontSize={'36px'}
              fontWeight={'600'}
              color={'#F6F6F6'}
              mr={'12px'}
            >
              {showLoader ? (
                <CircularProgress />
              ) : (
                `$ ${tokenDetails?.price?.toFixed(3)}`
              )}
              
            </Typography>
            <img
              src={Indicator}
              style={{
                transform:
                  tokenDetails?.priceChangeIn24Hr < 0
                    ? 'rotateX(180deg)'
                    : 'none',
              }}
              height={'14px'}
            />
            <Typography fontSize={'20px'} fontWeight={'600'} color={'#03D9AF'}>
              {!showLoader && tokenDetails?.priceChangeIn24Hr?.toFixed(2)}%
            </Typography>
          </Grid>
        </StatsBox>

        <StatsBox md={2.8} xs={12}>
          <Grid container marginBottom={'12px'}>
            {<img src={VanarToken} height={'24px'} />}
            <Typography fontSize={'16px'} color={'#F6F6F6'} marginLeft={0.5}>
              ABC marketcap 
            </Typography>
          </Grid>
          <Grid>
            <Typography fontSize={'36px'} fontWeight={'600'} color={'#F6F6F6'}>
              {showLoader ? (
                <CircularProgress />
              ) : (
               `$ ${formatNumber(tokenDetails?.marketCap)}`
              )}
            </Typography>
          </Grid>
        </StatsBox>
      </Grid>

      <Grid
        container
        flexDirection={'row'}
        justifyContent={'space-between'}
        alignItems={'center'}
        
      >
        <StatsBoxLarge
          md={5.8}
          xs={12}
          container
          justifyContent={'center'}
          alignItems={'center'}
          mt={2}
        >
          <Grid
            container
            marginBottom={'12px'}
            justifyContent={'center'}
            alignItems={'center'}
          >
            <img src={VanarToken} height={'24px'} />
            <Typography fontSize={'16px'} color={'#F6F6F6'} marginLeft={0.5}>
              Total ABC Staked
            </Typography>
          </Grid>

          <Grid container justifyContent={'center'} alignItems={'center'}>
            <img src={StakingIcon} height={'148px'} />
          </Grid>

          <Grid container justifyContent={'center'} alignItems={'center'}>
            <Typography fontSize={'40px'} color={'#F6F6F6'} fontWeight={'600'}>
              {stakedAmount ? stakedAmount : '0'}
            </Typography>
          </Grid>
        </StatsBoxLarge>
        <StatsBoxLarge
          md={5.8}
          xs={12}
          container
          justifyContent={'center'}
          alignItems={'center'}
          mt={2}
        >
          <Grid
            container
            marginBottom={'12px'}
            justifyContent={'center'}
            alignItems={'center'}
          >
            <img src={VanarToken} height={'24px'} />
            <Typography fontSize={'16px'} color={'#F6F6F6'} marginLeft={0.5}>
              Average APY
            </Typography>
          </Grid>

          <Grid container justifyContent={'center'} alignItems={'center'}>
            <img src={APY} height={'148px'} />
          </Grid>

          <Grid container justifyContent={'center'} alignItems={'center'}>
            <Typography fontSize={'40px'} color={'#F6F6F6'} fontWeight={'600'}>
              2.8%
            </Typography>
          </Grid>
        </StatsBoxLarge>
      </Grid>
    </Grid>
  )
}

export default StatsTab
