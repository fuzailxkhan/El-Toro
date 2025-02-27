import { Button, Chip, FormControl, Grid, Input, InputLabel, MenuItem, Select, SelectChangeEvent, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { InputContainer, StakingContainer } from './styles'
// import TabsComponent from './tabs'
import { validateAndFormatInput } from '../../../src/utils/index'
import {  ethers } from 'ethers'
import WalletButtons from '@components/WalletButtons'
import { useAccount, useWriteContract, useWalletClient, useChainId } from 'wagmi'
import {ConnectionType} from '../../connection/index'
// import {VanarToken} from '../../assets/index'
import { farmAbi } from '@components/StakingTabs/farmContract'
import { erc20Abi } from 'viem'
import { useSwitchChain } from 'wagmi'
import SwapVerticalCircleIcon from '@mui/icons-material/SwapVerticalCircle';
import { CryptoInterface } from './analytics'


const SwapTab = () => {
  const swapableCurrencyList = [
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

  
  
  const { writeContract } = useWriteContract();
  const { chains, switchChain } = useSwitchChain();
  const chainId = useChainId();
  
  const { address, isConnected } = useAccount();
  const [swapCurrency, setSwapCurrency] = useState('');
  const [forCurrency, setForCurrency] = useState('');
  const [swapAmount, setSwapAmount] = useState('');
  const [cryptoData, setCryptoData] = useState<{ [key: string]: number }>({});
  
  // Computed rates
  const [conversionRate, setConversionRate] = useState('');
  const [swapToUsdtRate, setSwapToUsdtRate] = useState('');
  const [forToUsdtRate, setForToUsdtRate] = useState('');

  const [swapBalance, setSwapBalance] = useState('0');
  const [forBalance, setForBalance] = useState('0');
  
  // Fetch real-time crypto data
  useEffect(() => {
    const eventSource = new EventSource('http://localhost:3000/market/stream');
  
    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        const priceMap = data.reduce((acc: any, curr: any) => {
          acc[curr.name] = curr.current_price;
          return acc;
        }, {});
        setCryptoData(priceMap);
      } catch (err) {
        console.error('Error parsing SSE data:', err);
      }
    };
  
    eventSource.onerror = () => {
      console.error('SSE connection error');
      eventSource.close();
    };
  
    return () => {
      eventSource.close();
    };
  }, []);
  
  // Compute rates dynamically
useEffect(() => {
  if (!swapCurrency ) return;

  // 1 swapCurrency = ? forCurrency
  const swapPriceInUsdt = cryptoData[swapCurrency]; // Price in USDT
  const forPriceInUsdt = cryptoData[forCurrency]; // Price in USDT

  if(swapCurrency=='USDT'){
    setConversionRate((1 / forPriceInUsdt)?.toFixed(6));
  }else if(forCurrency=='USDT'){
    setConversionRate((swapPriceInUsdt / 1)?.toFixed(6));
  }else{
  setConversionRate((swapPriceInUsdt / forPriceInUsdt)?.toFixed(6));}

  // 1 swapCurrency = ? USDT
  if(swapCurrency!='USDT')
  {
    setSwapToUsdtRate(swapPriceInUsdt?.toFixed(6));}
  else{
    setSwapToUsdtRate('1');
  }

  // 1 forCurrency = ? USDT
  if(forCurrency!='USDT'){
    
    setForToUsdtRate(forPriceInUsdt?.toFixed(6));
  }else{
    setForToUsdtRate('1')
  }
  

}, [swapCurrency , cryptoData]);

useEffect(()=>{
  if (!swapCurrency ) return;

  
  // 1 swapCurrency = ? forCurrency
  const swapPriceInUsdt = cryptoData[swapCurrency]; // Price in USDT
  const forPriceInUsdt = cryptoData[forCurrency]; // Price in USDT


  if(swapCurrency=='USDT'){
    setConversionRate((1 / forPriceInUsdt)?.toFixed(6));
  }else if(forCurrency=='USDT'){
    setConversionRate((swapPriceInUsdt / 1)?.toFixed(6));
  }else{
  setConversionRate((swapPriceInUsdt / forPriceInUsdt)?.toFixed(6));}

  if(swapCurrency!='USDT')
    {
      setSwapToUsdtRate(swapPriceInUsdt?.toFixed(6));}
    else{
      setSwapToUsdtRate('1');
    }
  
    // 1 forCurrency = ? USDT
    if(forCurrency!='USDT'){
      
      setForToUsdtRate(forPriceInUsdt?.toFixed(6));
    }else{
      setForToUsdtRate('1')
    }
},[forCurrency , cryptoData])

useEffect(() => {
  if (!address || !swapCurrency) return;


  if(window.ethereum){
    const provider = new ethers.providers.Web3Provider(window.ethereum); // ✅ Define inside effect


    if (swapCurrency === 'ETH') {
      // Get native token balance
      provider.getBalance(address).then(balance => {
        setSwapBalance(ethers.utils.formatEther(balance));
      });
    } else {
      // Find the token from swapableCurrencyList
        const token = swapableCurrencyList.find((token) => token.symbol === swapCurrency);
        
        if (token) {
          getTokenBalance(token.address).then((balance) => {
            setSwapBalance(balance || "0");
          });
        } else {
          console.error("Token not found:", swapCurrency);
          setSwapBalance("0");
        }
    }
  }
}, [swapCurrency, address]);

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

        const token = swapableCurrencyList.find((token) => token.symbol === swapCurrency);
          
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

  
  useEffect(() => {
    if (chainId !== 11155111) {
      switchChain({ chainId: 11155111 });
    }
  }, [chainId]);

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

  const getNativeBalance = async () => {
    if (!address) return;
    if(window.ethereum){
      const provider = new ethers.providers.Web3Provider(window.ethereum);
    const balance = await provider.getBalance(address);
    console.log("ETH Balance:", ethers.utils.formatEther(balance));
    }else{
      return
    }
    
  };
  
  const handleSwapCurrencyChange = (event: SelectChangeEvent) => {
    const value = event.target.value as string;
    if (value === forCurrency) return; // Prevent selecting the same currency
    setSwapCurrency(value);
  };
  
  const handleForCurrencyChange = (event: SelectChangeEvent) => {
    const value = event.target.value as string;
    if (value === swapCurrency) return; // Prevent selecting the same currency
    setForCurrency(value);
  };
  
  const farmContract = '0x43D01420604f84308923542aB6959B7f13C9B766';
  const wethAddress = '0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14';
  const usdcAddress = '0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238';
  const uniAddress = '0x1f9840a85d5af5bf1d1762f925bdaddc4201f984';
  
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
  
  const grantAllowance = async () => {
    const signer = await getSigner();
    const amount = ethers.utils.parseEther('1000');
  
    // @ts-ignore
    const tokenA = new ethers.Contract(wethAddress, erc20Abi, signer);
    await tokenA.approve(farmContract, amount);
  };
  
  // Add Liquidity
  const addLiquidity = async () => {
    // @ts-ignore
    await writeContract({
      address: farmContract,
      abi: farmAbi,
      functionName: 'addLiquidity',
      args: [
        usdcAddress,
        uniAddress,
        ethers.utils.parseEther('10'),
        ethers.utils.parseEther('0.0000001')
      ]
    });
  };
  
  // Swap Function
  const onSwap = async () => {
    if (!swapAmount || parseFloat(swapAmount) <= 0) {
      console.error('Invalid swap amount');
      return;
    }
  
    const amountIn = ethers.utils.parseEther(swapAmount);
    const amountOutMin = 1;
  
    // @ts-ignore
    const tx2 = await writeContract({
      address: farmContract,
      abi: farmAbi,
      functionName: 'swap',
      args: [amountIn, amountOutMin, wethAddress, uniAddress, address]
    });
  
    console.log('tx 2', tx2);
  };
  

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
          onClick={onSwap}
          // disabled={!depositAmount}
          // disabled={true}
        >
          Swap
        </Button>
      )
  }

  return (
    <Grid container xs={10} md={3.5} >
    <Grid
      container
      flexDirection={'column'}
      justifyContent={'center'}
      alignItems={'center'}
      gap={'12px'}
      mt={'50px'}
    >
      <Typography fontSize={'40px'} fontWeight={'600'} color={'#F6F6F6'}>
        Swap
      </Typography>
      <Typography
        fontSize={'16px'}
        fontWeight={'500'}
        color={'#F6F6F6'}
        sx={{ opacity: '0.7' }}
      >
        Seamlessly Exchange Your Favorite Tokens
      </Typography>
    </Grid>

    <StakingContainer mt={'24px'} minHeight={'400px'} container>
    <Grid container >
      <InputContainer container minHeight={'120px'} sx={{marginBottom:'2px' ,marginTop:'2px'}}>
        <Grid display={'flex'} justifyContent={'space-between'} width={'100%'} sx={{marginTop:'0px'}}>
          <Typography color={'#F6F6F6'} fontSize={'16px'}>
            Swap 
          </Typography>

          <Grid display={'flex'} alignItems={'center'}>
            {/* <img src={VanarToken} height={'18px'} /> */}
            
          </Grid>
        </Grid>

        <Grid container alignItems={'center'} sx={{ flexWrap: 'nowrap'}}>
          <Input
            placeholder="0"
            value={swapAmount}
            onChange={e => {
              const formattedValue = validateAndFormatInput(e.target.value)
              setSwapAmount(formattedValue)
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
            {!swapCurrency && (
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
              value={swapCurrency}
              label="Select Token"
              displayEmpty
              renderValue={(selected) => (selected ? selected : '')}
              onChange={handleSwapCurrencyChange}
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
              {swapableCurrencyList.map((curr) => (
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

        {swapCurrency && (
          <Grid display="flex" justifyContent="space-between" width="100%">
            <Typography color="#F6F6F6" fontSize="10px" sx={{ opacity: "0.5" }}>
              1 {swapCurrency} = {Number(swapToUsdtRate).toFixed(3)} USDT
            </Typography>
            <Typography color="#F6F6F6" fontSize="10px" sx={{ opacity: "0.5" }}>
              Wallet = {Number(swapBalance).toFixed(3)} {swapCurrency}
            </Typography>
          </Grid>
        )}
      
              
      
      </InputContainer>


      {/* {console.log('active lockup option', activeLockupOption)} */}
      <Grid sx={{display:'flex' , alignItems:'center', justifyContent:'center', width:'100%', position: 'relative'}}>
        <SwapVerticalCircleIcon fontSize='large' sx={{ position: 'absolute', top: '-20px' }}/>        
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
            value={swapAmount ? (Number(swapAmount) * Number(conversionRate)).toFixed(5) : '0'}
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
              {swapableCurrencyList.map((curr) => (
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
              1 {forCurrency} = {Number(forToUsdtRate).toFixed(3)} USDT
            </Typography>
            <Typography color="#F6F6F6" fontSize="10px" sx={{ opacity: "0.5" }}>
              Wallet = {Number(forBalance).toFixed(3)} {forCurrency}
            </Typography>
          </Grid>
        )}
      
      </InputContainer>
    
      {(swapCurrency && forCurrency) && (
        <Typography margin="auto" fontSize="12px">
          1 {swapCurrency} = {conversionRate} {forCurrency}
        </Typography>
      )}
      <RenderButton />
      
    </Grid>
      
    </StakingContainer>
    
  </Grid>
  )
}

export default SwapTab
