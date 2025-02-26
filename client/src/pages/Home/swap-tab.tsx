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
      name:'USDT', 
      symbol:'USDT',
      address:'0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238'
    },
    {
      name: "UNI",
      symbol: "UNI",
      address: "0x1f9840a85d5af5bf1d1762f925bdaddc4201f984"
    }
  ]

  const { address, isConnecting, isDisconnected, isConnected } = useAccount()
  const [swapCurrency, setSwapCurrency] = useState('');
  const [forCurrency, setForCurrency] = useState('');
  const [swapAmount, setSwapAmount] = useState('');
  const [forAmount, setForAmount] = useState('');
  const [cryptoData , setCryptoData] = useState<CryptoInterface[]>();
  const [forRate,setForRate] = useState('');
  const [swapRate,setSwapRate] = useState('');

  useEffect(() => {
    const eventSource = new EventSource('http://localhost:3000/market/stream');
    eventSource.onmessage = (event) => {
      try {
        const data: CryptoInterface[] = JSON.parse(event.data);
        setCryptoData(data);
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

  // Calculate rates and update `forAmount`
  useEffect(() => {
    console.log("SC =>",swapCurrency,"FC =>",forCurrency,"SA =>",swapAmount)
    if (!swapCurrency || !forCurrency || !swapAmount || !cryptoData?.length) return;

    // Find swap and for currency rates
    const swapData = cryptoData?.find((item) => item?.name === swapCurrency);
    const forData = cryptoData?.find((item) => item?.name === forCurrency);
    console.log("Setting Swap Rate =>", swapRate  )
    console.log("Setting For Rate =>", forRate)
    if (swapData && forData) {
      setSwapRate(swapData.current_price.toString());
      console.log("Setting Swap Rate =>", swapRate  )
      setForRate(forData.current_price.toString());
      console.log("Setting For Rate =>", forRate)

      const calculatedForAmount = (parseFloat(swapAmount) * swapData.current_price) / forData.current_price;
      setForAmount(calculatedForAmount.toFixed(6)); // Limiting to 6 decimal places
      console.log("Setting For Amount =>", forAmount)
    }
  }, [swapCurrency, forCurrency, swapAmount, cryptoData]);


  const {
    writeContract,
    data,
    isError,
    writeContractAsync,
    isPending,
    isSuccess,
  } = useWriteContract()
  const { data: walletClient } = useWalletClient();
  const { chains, switchChain } = useSwitchChain()
  const chainId = useChainId()
  

  useEffect(() => {
    if(chainId !== 11155111) {
      switchChain({ chainId: 11155111 })
    }
  }, [chainId])


  const handleSwapCurrnecyChange = (event:SelectChangeEvent) => {
    setSwapCurrency(event.target.value as string)
  }

  const handleForCurrnecyChange = (event:SelectChangeEvent) => {
    setForCurrency(event.target.value as string)
  }

  const farmContract = '0x43D01420604f84308923542aB6959B7f13C9B766';
  
  const wethAddress = '0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14';
  const usdcAddress = '0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238';
  const uniAddress = "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984";

  
async function getSigner() {
    if (typeof window.ethereum === "undefined") {
        console.error("Metamask is not installed");
        return null;
    }

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();

    console.log("Signer Address:", await signer.getAddress());
    return signer;
}



  const grantAllowance = async () => {
    const signer = await getSigner()
    const amount = ethers.utils.parseEther('1000');

    // @ts-ignore //
    const tokenA = new ethers.Contract(wethAddress, erc20Abi, signer);
    await tokenA.approve(farmContract, amount);
  }


  // Add Liquidity
  const addLiquidity = async () => {
  
    // @ts-ignore //
    await writeContract({
      address: farmContract,
      abi: farmAbi,
      functionName: 'addLiquidity',
      args: [usdcAddress, uniAddress, ethers.utils.parseEther('10'), ethers.utils.parseEther('0.0000001')],
    })
  }


  /////////////////////  Swap on Sepolia  /////////////////
  const onSwap = async () => {

  
    // in the parse ether field, we need to pass the amount of the token we want to swap
    const amountIn = ethers.utils.parseEther(swapAmount);
    const amountOutMin = 1;

    // @ts-ignore //
    const tx2 = await writeContract({
      address: farmContract,
      abi: farmAbi,
      functionName: 'swap',     
      args: [amountIn, amountOutMin, wethAddress, uniAddress, address],
    });

    console.log('tx 2', tx2);

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
              onChange={handleSwapCurrnecyChange}
              sx={{
                m:0,
                fontSize: '18px',
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

        <Grid display={'flex'} justifyContent={'space-between'} width={'100%'}>
      
        </Grid>
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
            value={forAmount}
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
              onChange={handleForCurrnecyChange}
              sx={{
                m:0,
                fontSize: '18px',
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

        <Grid display={'flex'} justifyContent={'space-between'} width={'100%'}>
      
        </Grid>
      </InputContainer>
    
      {(swapCurrency&&forCurrency)&&
      <Typography margin={"auto"} fontSize={"12px"}>
        {swapRate} {swapCurrency} = {forRate} {forCurrency}
      </Typography>}
      <RenderButton />
      
    </Grid>
      
    </StakingContainer>
    
  </Grid>
  )
}

export default SwapTab
