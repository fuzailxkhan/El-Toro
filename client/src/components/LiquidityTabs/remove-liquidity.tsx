import { Button, FormControl, Grid, Input, InputLabel, MenuItem, Select, SelectChangeEvent, Typography } from '@mui/material'
import { AddLiquidityContainer, InputContainer } from '@pages/Home/styles'
import { validateAndFormatInput } from '../../../src/utils/index'
import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange';
import React, { useEffect, useState } from 'react'
import { useAccount, useWriteContract } from 'wagmi';
import { ethers } from 'ethers';
import { erc20Abi } from 'viem';
import WalletButtons from '@components/WalletButtons';
import { ConnectionType } from '../../connection/index';
import { farmAbi } from '@components/StakingTabs/farmContract';

const RemoveLiquidity = () => {

    const [toroAmount,setToroAmount] = useState('')

    const [usdcAmount,setUsdcAmount] = useState('')

    // const [conversionRate,setConversionRate] = useState('')
    
    // const [toroBalance,setToroBalance] = useState('')
    // const [usdcBalance,setUsdcBalance] = useState('')

    const { address, isConnected } = useAccount();


        console.log("Liquidate")
        const { writeContract } = useWriteContract();
    
    const onRemoveLiquidity = async () => {
      const farmContract = '0x43D01420604f84308923542aB6959B7f13C9B766';

         
            const alphaToken = "0xfAC5236D60Ba219268d1ef73720a94DB34dee72b";
            const betaToken = "0xd34c3b5F65dD10668a4EeaeD447567Eb797bB94d"
           
            console.log('adding liqduity')
           
            // @ts-ignore //
            await writeContract({
              address: farmContract,
              abi: farmAbi,
              functionName: 'removeLiquidity',
              args: [alphaToken, betaToken],
            })
          
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
              onClick={onRemoveLiquidity}
              // disabled={!depositAmount}
              // disabled={true}
            >
             Remove Liquidity
            </Button>
          )
      }

return (

  <Grid container marginTop={'28px'} >
            <Grid display={'flex'} justifyContent={'space-between'} width={'100%'} sx={{marginTop:'-10px',marginBottom:'10px'}}>
              <Typography fontSize={'16px'} fontWeight={'500'} color={'#F6F6F6'} margin={'auto'}  sx={{ opacity: '0.7' }}>
                Remove TORO/USDC pair from Liquidity 
              </Typography>
            </Grid>
  <InputContainer container minHeight={'120px'} sx={{marginBottom:'2px' ,marginTop:'2px'}}>
    <Grid display={'flex'} justifyContent={'space-between'} width={'100%'} sx={{marginTop:'0px'}}>
      <Typography color={'#F6F6F6'} fontSize={'16px'}>
        Remove Toro 
      </Typography>

      <Grid display={'flex'} alignItems={'center'}>
        {/* <img src={VanarToken} height={'18px'} /> */}
        
      </Grid>
    </Grid>

    <Grid container alignItems={'center'} sx={{ flexWrap: 'nowrap'}}>
      <Input
        placeholder="0"
        value={toroAmount}
        onChange={e => {
          const formattedValue = validateAndFormatInput(e.target.value)
          setToroAmount(formattedValue)
        }}
        onKeyDown={e => {
          if (e.key === 'e' || e.key === '-' || e.key === '+') {
            e.preventDefault()
          }
        }}
        disableUnderline
        disabled
        type="number"
        sx={{
          textAlign:"end",
          width: '100%',
          color: 'gray',
          '& .MuiInputBase-input.Mui-disabled': {
              WebkitTextFillColor: '#175b4d', // Ensures color override
            },
        }}
        inputProps={{
          style: { textAlign: "right" }, // Aligns text to the right
        }}
        
      />
    </Grid>
  
          
  
  </InputContainer>


  {/* {console.log('active lockup option', activeLockupOption)} */}
  <Grid sx={{display:'flex' , alignItems:'center', justifyContent:'center', width:'100%', position: 'relative'}}>
    <CurrencyExchangeIcon sx={{ position: 'absolute', top: '-15px' , fontSize:'28px'}}/>        
  </Grid>
          
  <InputContainer container minHeight={'120px'} sx={{ marginTop: '2px', marginBottom:'20px'}}> 
    <Grid display={'flex'} justifyContent={'space-between'} width={'100%'}>
      <Typography color={'#F6F6F6'} fontSize={'16px'}>
        Remove USDC 
      </Typography>

      <Grid display={'flex'} alignItems={'center'}>
        {/* <img src={VanarToken} height={'18px'} /> */}
        
      </Grid>
    </Grid>

    <Grid container alignItems={'center'} sx={{ flexWrap: 'nowrap' }}>
      <Input
        placeholder="0"
        value={usdcAmount}
        onChange={e => {
          const formattedValue = validateAndFormatInput(e.target.value)
          setUsdcAmount(formattedValue)
        }}
        onKeyDown={e => {
          if (e.key === 'e' || e.key === '-' || e.key === '+') {
            e.preventDefault()
          }
        }}
        disableUnderline
        type="number"
        disabled
        sx={{
          width: '100%',
          color: 'gray',
          '& .MuiInputBase-input.Mui-disabled': {
              WebkitTextFillColor: '#175b4d', // Ensures color override
            },
        }}
        inputProps={{
          style: { textAlign: "right" }, // Aligns text to the right
        }}
      />
    </Grid>

  
  </InputContainer>

  <RenderButton />
  
</Grid>
)

}

export default RemoveLiquidity
