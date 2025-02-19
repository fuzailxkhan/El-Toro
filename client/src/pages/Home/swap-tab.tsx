import { Button, Chip, FormControl, Grid, Input, InputLabel, MenuItem, Select, SelectChangeEvent, Typography } from '@mui/material'
import React, { useState } from 'react'
import { InputContainer, StakingContainer } from './styles'
import TabsComponent from './tabs'
import { validateAndFormatInput } from '@utils/*'
import { BigNumber } from 'ethers'
import WalletButtons from '@components/WalletButtons'
import { useAccount } from 'wagmi'
import {ConnectionType} from '../../connection/index'
import {VanarToken} from '../../assets/index'



const SwapTab = () => {

  const swapableCurrencyList = [
    {
      name: 'Ethereum',
      symbol: 'Eth',
      address: '0x'},
      {
        name:'Bitcoin',
        symbol:'Btc',
        address:'0x'
      }
  ]

  const { address, isConnecting, isDisconnected, isConnected } = useAccount()
  const [swapCurrency, setSwapCurrency] = useState('');
  const [toCurrency, setToCurrency] = useState('Toro')

  const handleSwapCurrnecyChange = (event:SelectChangeEvent) => {
    setSwapCurrency(event.target.value as string)
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
          // onClick={onStake}
          // disabled={!depositAmount}
          disabled={true}
        >
          Swap
        </Button>
      )
  }

  return (
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
        Swap Toro
      </Typography>
      <Typography
        fontSize={'16px'}
        fontWeight={'500'}
        color={'#F6F6F6'}
        sx={{ opacity: '0.7' }}
      >
        Select how much Toro you want to swap  
      </Typography>
    </Grid>

    <StakingContainer mt={'24px'} minHeight={'516px'} container>
    <Grid container>
      <InputContainer container minHeight={'140px'}>
        <Grid display={'flex'} justifyContent={'space-between'} width={'100%'}>
          <Typography color={'#F6F6F6'} fontSize={'16px'}>
            Swap 
          </Typography>

          <Grid display={'flex'} alignItems={'center'}>
            {/* <img src={VanarToken} height={'18px'} /> */}
            
          </Grid>
        </Grid>

        <Grid container alignItems={'center'} sx={{ flexWrap: 'nowrap' }}>
          <Input
            placeholder="0"
            // value={depositAmount}
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
            }}
          />
          <FormControl variant="standard" sx={{ minWidth: '80px', color: 'white', fontSize: '12px' }}>
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
      <Typography
        color={'#F6F6F6'}
        fontSize={'16px'}
        fontWeight={'700'}
        textAlign={'center'}
        width={'100%'}
        mt={'15px'}
        mb={'15px'}
      >
        You are swapping {swapCurrency} for {toCurrency}
        
      </Typography>

      <InputContainer container minHeight={'140px'} marginTop={0}>
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
            // value={depositAmount}
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
            }}
          />
          <FormControl variant="standard" sx={{ minWidth: '80px', color: 'white', fontSize: '12px' }}>
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

      <RenderButton />
    </Grid>
      
    </StakingContainer>
  </Grid>
  )
}

export default SwapTab
