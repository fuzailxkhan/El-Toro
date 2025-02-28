import { Button, FormControl, Grid, Input, InputLabel, MenuItem, Select, SelectChangeEvent, Typography } from '@mui/material'
import { AddLiquidityContainer, InputContainer } from '@pages/Home/styles'
import { validateAndFormatInput } from '../../../src/utils/index'
import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange';
import React, { useEffect, useState } from 'react'
import { useAccount } from 'wagmi';
import { ethers } from 'ethers';
import { erc20Abi } from 'viem';
import WalletButtons from '@components/WalletButtons';
import { ConnectionType } from '../../connection/index';

const AddLiquidity = () => {

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

    const [fromCurrency,setFromCurrency] = useState('')
    const [fromAmount,setFromAmount] = useState('')

    const [forCurrency, setForCurrency] = useState('')
    const [forAmount,setForAmount] = useState('')

    const [conversionRate,setConversionRate] = useState('')
    
    const [forBalance,setForBalance] = useState('')
    const [fromBalance,setFromBalance] = useState('')

    const { address, isConnected } = useAccount();

    useEffect(() => {
      if (!address || !forCurrency) return;
    
      if(window.ethereum){
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        // ✅ Define inside effect
    
    
        if (forCurrency === 'ETH') {
          provider.getBalance(address).then(balance => {
            setForBalance(ethers.utils.formatEther(balance));
          });
        } else {
    
            const token = currencyList.find((token) => token.symbol === fromCurrency);
              
            if (token) {
            getTokenBalance(token.address).then(balance => {
              setForBalance(balance || '0');
            });}else{
              console.error("Token not Found",forCurrency);
              setForBalance('0')
            }
        }
      }
    }, [forCurrency, address]);


    const handleFromCurrencyChange = (event: SelectChangeEvent) => {
        const value = event.target.value as string;
        if (value === forCurrency) return; // Prevent selecting the same currency
        setFromCurrency(value);
      };

    const handleForCurrencyChange = (event: SelectChangeEvent) => {
        const value = event.target.value as string;
        if (value === fromCurrency) return; // Prevent selecting the same currency
        setForCurrency(value);
      };

        const getTokenBalance = async (tokenAddress: string) => {
          if (!address || !window.ethereum) return;
      
              
      
        
          try {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            const contract = new ethers.Contract(tokenAddress, erc20Abi, signer);
        
            const balance = await contract.balanceOf(address);
            return ethers.utils.formatUnits(balance, 18); // Assuming 18 decimal places
          } catch (error) {
            console.error("Error fetching token balance:", error);
          }
        };

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
                  onClick={onLiquidate}
                  // disabled={!depositAmount}
                  // disabled={true}
                >
                  Swap
                </Button>
              )
          }
    
  return (
    
    <Grid container marginTop={'28px'} >
      <InputContainer container minHeight={'120px'} sx={{marginBottom:'2px' ,marginTop:'2px'}}>
        <Grid display={'flex'} justifyContent={'space-between'} width={'100%'} sx={{marginTop:'0px'}}>
          <Typography color={'#F6F6F6'} fontSize={'16px'}>
            From 
          </Typography>

          <Grid display={'flex'} alignItems={'center'}>
            {/* <img src={VanarToken} height={'18px'} /> */}
            
          </Grid>
        </Grid>

        <Grid container alignItems={'center'} sx={{ flexWrap: 'nowrap'}}>
          <Input
            placeholder="0"
            value={fromAmount}
            onChange={e => {
              const formattedValue = validateAndFormatInput(e.target.value)
              setFromAmount(formattedValue)
            }}
            onKeyDown={e => {
              if (e.key === 'e' || e.key === '-' || e.key === '+') {
                e.preventDefault()
              }
            }}
            disableUnderline
            type="number"
            sx={{
              width: '100%'
            }}
            
          />
          <FormControl variant="standard" sx={{ minWidth: '80px', color: 'white', fontSize: '12px', marginTop:0 }}>
            {!fromCurrency && (
              <InputLabel
                id="demo-simple-select-standard-label"
                sx={{ color: 'white', fontSize: '16px', mb:'5px' }}
              >
                Token
              </InputLabel>
            )}
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={fromCurrency}
              label="Select Token"
              displayEmpty
              renderValue={(selected) => (selected ? selected : '')}
              onChange={handleFromCurrencyChange}
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
          </FormControl>
        </Grid>

        {/* {swapCurrency && (
          <Grid display="flex" justifyContent="space-between" width="100%">
            <Typography color="#F6F6F6" fontSize="10px" sx={{ opacity: "0.5" }}>
              1 {swapCurrency} = {Number(swapToUsdtRate).toFixed(3)} USDT
            </Typography>
            {address&&<Typography color="#F6F6F6" fontSize="10px" sx={{ opacity: "0.5" }}>
              Wallet = {Number(swapBalance).toFixed(3)} {swapCurrency}
            </Typography>
          </Grid>
        )} */}
      
              
      
      </InputContainer>


      {/* {console.log('active lockup option', activeLockupOption)} */}
      <Grid sx={{display:'flex' , alignItems:'center', justifyContent:'center', width:'100%', position: 'relative'}}>
        <CurrencyExchangeIcon sx={{ position: 'absolute', top: '-15px' , fontSize:'28px'}}/>        
      </Grid>
              
      <InputContainer container minHeight={'120px'} sx={{ marginTop: '2px', marginBottom:'20px'}}> 
        <Grid display={'flex'} justifyContent={'space-between'} width={'100%'}>
          <Typography color={'#F6F6F6'} fontSize={'16px'}>
            For 
          </Typography>

          <Grid display={'flex'} alignItems={'center'}>
            {/* <img src={VanarToken} height={'18px'} /> */}
            
          </Grid>
        </Grid>

        <Grid container alignItems={'center'} sx={{ flexWrap: 'nowrap' }}>
          <Input
            placeholder="0"
            value={forAmount ? (Number(forAmount) * Number(conversionRate)).toFixed(5) : '0'}
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
            disabled
            sx={{
              width: '100%',
              color: 'gray',
              '& .MuiInputBase-input.Mui-disabled': {
                  WebkitTextFillColor: '#175b4d', // Ensures color override
                },
            }}
          />
          <FormControl variant="standard" sx={{ minWidth: '80px', color: 'white', fontSize: '12px' }}>
            {!forCurrency && (
              <InputLabel
                id="demo-simple-select-standard-label"
                sx={{ color: 'white', fontSize: '16px', mb:'5px' }}
              >
                Token
              </InputLabel>
            )}
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={forCurrency}
              label="Select Token"
              displayEmpty
              renderValue={(selected) => (selected ? selected : '')}
              onChange={handleForCurrencyChange}
              
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
          </FormControl>
        </Grid>

        {forCurrency && (
          <Grid display="flex" justifyContent="space-between" width="100%">
            <Typography color="#F6F6F6" fontSize="10px" sx={{ opacity: "0.5" }}>
              {/* 1 {forCurrency} = {Number(forToUsdtRate).toFixed(3)} USDT */}
            </Typography>
            {address&&<Typography color="#F6F6F6" fontSize="10px" sx={{ opacity: "0.5" }}>
              Wallet = {Number(forBalance).toFixed(3)} {forCurrency}
            </Typography>}
          </Grid>
        )}
      
      </InputContainer>
    
      {(fromCurrency && forCurrency) && (
        <Typography margin="auto" fontSize="12px">
          1 {fromCurrency} = {conversionRate} {forCurrency}
        </Typography>
      )}
      <RenderButton />
      
    </Grid>
  )
}

export default AddLiquidity
