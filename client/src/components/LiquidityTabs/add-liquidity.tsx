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
import { farmingContractAddress } from '@components/StakingTabs/contract';
import { farmAbi } from '@components/StakingTabs/farmContract';

const AddLiquidity = () => {


    const { writeContract } = useWriteContract();
  

    const currencyList = [
        {
          name: 'ETH',
          symbol: 'ETH',
          address: '0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14'
        },
        {
          name: 'USDT',
          symbol: 'USDT',
          address: '0xdAC17F958D2ee523a2206206994597C13D831ec7'
        },
        {
          name: 'UNI',
          symbol: 'UNI',
          address: '0x1f9840a85d5af5bf1d1762f925bdaddc4201f984'
        }
      ];

  const toroTokenAddress = '0x3BB6F518aB08Fc9FE5C40ad064Ba7a826bFE3b33';
  const usdcTokenAddress = '0x158d6AfF3cA9a09DCC9d0892E07Bda8a9D140CdD';
  const uniswapV2RouterAddress = "0xeE567Fe1712Faf6149d80dA1E6934E354124CfE3";


    async function getSigner() {
      if (typeof window.ethereum === 'undefined') {
        console.error('Metamask is not installed');
        return null;
      }
    
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send('eth_requestAccounts', []);
      const signer = provider.getSigner();
    
      console.log('Signer Address:', await signer.getAddress());
      return signer;
    }

    const farmContract = '0x43D01420604f84308923542aB6959B7f13C9B766';

    const grantAllowance = async () => {
      const signer = await getSigner();
      const amount = ethers.utils.parseEther('1000000000000000000000000');
    

      const tokenAAddress = "0xCED86068e7B67DaCCf77E05dDd27663793c132Aa";
  
      // @ts-ignore
      const tokenA = new ethers.Contract(tokenAAddress, erc20Abi, signer);
      await tokenA.approve(farmContract, amount);
    };

  const addLiquidity = async () => {

    const alphaToken = "0xfAC5236D60Ba219268d1ef73720a94DB34dee72b";
    const betaToken = "0xd34c3b5F65dD10668a4EeaeD447567Eb797bB94d"
   
    console.log('adding liqduity')
    const amount = ethers.utils.parseEther(fromAmount);

    // @ts-ignore //
    await writeContract({
      address: farmContract,
      abi: farmAbi,
      functionName: 'addLiquidity',
      args: [alphaToken, betaToken, amount, amount],
    })
  }

    const [fromCurrency,setFromCurrency] = useState('')
    const [fromAmount,setFromAmount] = useState('')

    const [forCurrency, setForCurrency] = useState('')
    const [forAmount,setForAmount] = useState('')

    const [conversionRate,setConversionRate] = useState('')
    
    const [toroAmount,setToroAmount] = useState('')

    const [usdcAmount,setUsdcAmount] = useState('')

    // const [conversionRate,setConversionRate] = useState('')
    
    // const [toroBalance,setToroBalance] = useState('')
    // const [usdcBalance,setUsdcBalance] = useState('')

    const { address, isConnected } = useAccount();

        const onLiquidate = () =>{
            console.log("Liquidate")
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
                  onClick={addLiquidity}
                  // disabled={!depositAmount}
                  // disabled={true}
                >
                  Add Liquidity
                </Button>
              )
          }
    
  return (
    
    <Grid container marginTop={'28px'} >
        <Grid display={'flex'} justifyContent={'space-between'} width={'100%'} sx={{marginTop:'-10px',marginBottom:'10px'}}>
          <Typography fontSize={'16px'} fontWeight={'500'} color={'#F6F6F6'} margin={'auto'}  sx={{ opacity: '0.7' }}>
            Deposit ALPHA/BETA pair Liquidity 
          </Typography>
        </Grid>
      <InputContainer container minHeight={'120px'} sx={{marginBottom:'2px' ,marginTop:'2px'}}>
        <Grid display={'flex'} justifyContent={'space-between'} width={'100%'} sx={{marginTop:'0px'}}>
          <Typography color={'#F6F6F6'} fontSize={'16px'}>
            Deposit ALPHA 
          </Typography>
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
            type="number"
            sx={{
              textAlign:"end",
              width: '100%'
            }}
            inputProps={{
              style: { textAlign: "right" }, // Aligns text to the right
            }}
            
          />
          {/* <FormControl variant="standard" sx={{ minWidth: '80px', color: 'white', fontSize: '12px', marginTop:0 }}>
            {!fromCurrency && (
              <InputLabel
                id="demo-simple-select-standard-label"
                sx={{ color: 'white', fontSize: '16px', mb:'5px' }}
              >
                ALPHA
              </InputLabel>
            )}
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={fromCurrency}
              label="Select Token"
              displayEmpty
              renderValue={(selected) => (selected ? selected : '')}
              // onChange={handleFromCurrencyChange}
              sx={{
                m:0,
                fontSize: '18px',
                textAlign:'end',
                color: 'white', // Text color inside the Select
                '& .MuiSelect-select': {
                  fontSize: '18px', // Ensures selected option appears with 12px font size
                },
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'white', // Border color when not focused
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'white', // Border color on hover
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'white', // Border color when focused
                },
              }}
              MenuProps={{
                PaperProps: {
                  sx: {
                    bgcolor: '#121212', // Dropdown background color
                    color: 'white', // Dropdown text color
                    fontSize: '16px',
                    borderColor:'transparent',
                    textAlign:'start'
                  },
                },
              }}
            >
              
            </Select>
          </FormControl> */}
        </Grid>
      
              
      
      </InputContainer>


      {/* {console.log('active lockup option', activeLockupOption)} */}
      <Grid sx={{display:'flex' , alignItems:'center', justifyContent:'center', width:'100%', position: 'relative'}}>
        <CurrencyExchangeIcon sx={{ position: 'absolute', top: '-15px' , fontSize:'28px'}}/>        
      </Grid>
              
      <InputContainer container minHeight={'120px'} sx={{ marginTop: '2px', marginBottom:'20px'}}> 
        <Grid display={'flex'} justifyContent={'space-between'} width={'100%'}>
          <Typography color={'#F6F6F6'} fontSize={'16px'}>
            Deposit BETA 
          </Typography>

          <Grid display={'flex'} alignItems={'center'}>
            {/* <img src={VanarToken} height={'18px'} /> */}
            
          </Grid>
        </Grid>

        <Grid container alignItems={'center'} sx={{ flexWrap: 'nowrap' }}>
          <Input
            placeholder="0"
            value={toroAmount}
            // value={forAmount ? (Number(forAmount) * Number(conversionRate)).toFixed(5) : '0'}
            // onChange={e => {
            //   const formattedValue = validateAndFormatInput(e.target.value)
            //   setDepositAmount(formattedValue)
            // }}
            onKeyDown={e => {
              if (e.key === 'e' || e.key === '-' || e.key === '+') {
                e.preventDefault()
              }
            }}
            disableUnderline
            type="number"
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
          {/* <FormControl variant="standard" sx={{ minWidth: '80px', color: 'white', fontSize: '12px' }}>
            {!forCurrency && (
              <InputLabel
                id="demo-simple-select-standard-label"
                sx={{ color: 'white', fontSize: '16px', mb:'5px' }}
              >
                BETA
              </InputLabel>
            )}
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={forCurrency}
              label="Select Token"
              displayEmpty
              renderValue={(selected) => (selected ? selected : '')}
              // onChange={handleForCurrencyChange}
              
              sx={{
                m:0,
                fontSize: '18px',
                textAlign:'end',
                color: 'white', // Text color inside the Select
                '& .MuiSelect-select': {
                  fontSize: '18px', // Ensures selected option appears with 12px font size
                },
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'white', // Border color when not focused
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'white', // Border color on hover
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'white', // Border color when focused
                },
              }}
              MenuProps={{
                PaperProps: {
                  sx: {
                    bgcolor: '#121212', // Dropdown background color
                    color: 'white', // Dropdown text color
                    fontSize: '16px',
                    borderColor:'transparent',
                    textAlign:'start'
                  },
                },
               }}
            >
              {currencyList.map((curr) => (
                <MenuItem
                  key={curr.address}
                  value={curr.symbol}
                  sx={{
                    fontSize: '16px',
                    color: 'white', // Text color of MenuItem
                    '&.Mui-selected': {
                      backgroundColor: 'rgba(255, 255, 255, 0.2)', // Background of selected item
                    },
                    '&.Mui-selected:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.3)', // Background on hover when selected
                    },
                  }}
                >
                  {curr.symbol}
                </MenuItem>
              ))}
            </Select>
          </FormControl> */}
        </Grid>

      
      </InputContainer>
    
      <RenderButton />
      
    </Grid>
  )
}

export default AddLiquidity
