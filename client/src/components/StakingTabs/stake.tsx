import { useCallback, useEffect, useState } from 'react'

import { Button, Chip, Grid, Input, Typography } from '@mui/material'
import { useAppDispatch } from '@hooks/'
import {
  setAvailableContracts,
  setTxInProgress,
} from '@redux/slices/walletSlice'
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
import { validateAndFormatInput } from '@utils/index'
import { ChainContracts } from '../../hooks/useContract/types'
import {
  useAccount,
  useBalance,
  usePublicClient,
  useWriteContract,
  useChainId,
  useWaitForTransactionReceipt,
  useSendTransaction,
  useReadContract,
} from 'wagmi'
import { useWeb3Modal } from '@web3modal/wagmi/react'
import {
  estimateGas,
  getBalance as getBalanceWagmi,
  simulateContract,
  estimateFeesPerGas,
  // writeContract,
} from '@wagmi/core'
import { Address, createPublicClient } from 'viem'
import { http, createConfig, prepareTransactionRequest } from '@wagmi/core'
import { arbitrum, mainnet, bscTestnet } from 'wagmi/chains'
import { config } from './configuration'
import { farmingAbi, farmingContractAddress } from './contract'
import { uniswapFarmAbi } from './farmContract'
import { encodeFunctionData } from 'viem';
import { write } from 'fs'

// import { stakingManagerAbi, stakingManagerAddress } from '../../constants/contracts'

// import { useBalance } from 'wagmi';

const Stake = () => {
  const [depositAmount, setDepositAmount] = useState('')
  const [error, setError] = useState('')

  const [balance, setBalance] = useState('0')
  const [activeLockupOption, setActiveLockupOption] = useState(0)

  const chainId = useChainId()

  const { open } = useWeb3Modal()
  const { address, isConnecting, isDisconnected, isConnected } = useAccount()

  const {
    writeContract,
    data,
    isError,
    writeContractAsync,
    isPending,
    isSuccess,
  } = useWriteContract()

  const factoryAddress = "0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f"; // Uniswap V2 Factory on Holesky
  const factoryAbi = [
    {
      "name": "getPair",
      "type": "function",
      "stateMutability": "view",
      "outputs": [{ "internalType": "address", "name": "pair", "type": "address" }],
      "inputs": [
        { "internalType": "address", "name": "tokenA", "type": "address" },
        { "internalType": "address", "name": "tokenB", "type": "address" }
      ]
    }
  ];

  const tokenA = '0xc8f93d9738e7ad5f3af8c548db2f6b7f8082b5e8'; // WETH holesky
  const tokenB = '0x167F99B1449fc6be6def68ba249DA06464d89F8A'; // USDT

  const wethAddress = "0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6";
  const usdtAddress = "0x509ee0d083ddf8ac028f2a56731412edd63223b9";



    /* @ts-ignore */
       const { 
    data: poolData
   } = 
       /* @ts-ignore */
   useReadContract({
    address: factoryAddress,
    abi: factoryAbi,
    functionName: "getPair",
    args: [wethAddress, usdtAddress],
   });




   console.log('pool data', poolData);

  console.log('chain id', chainId)
  const contractsAndAbis = chainIdToContracts[chainId]
  const { stakingManagerAbi = '', stakingManagerAddress = '' } =
    contractsAndAbis ?? {}

  console.log('config', config)

  const getBalanceFromWagmi = async () => {
    if (address) {
      const balanceWagmi = await getBalanceWagmi(config, {
        address,
        blockTag: 'latest',
      })
      const { value, decimals } = balanceWagmi
      const formattedValue = ethers.utils.formatEther(value)
      return formattedValue
    }
  }

  const uniswapFarmContractAddress = '0xA90f678A0e2fd5FDBa6192e5Ad01aB16E1e56989';



  const wrapEthToWeth = async () => {
    console.log('111')
    if(window.ethereum === undefined) {
      return;
    }
    console.log('000')
    const WETH_ADDRESS = "0xc8f93d9738e7ad5f3af8c548db2f6b7f8082b5e8";
    const WETH_ABI = [
      "function deposit() public payable",
      "function balanceOf(address owner) public view returns (uint)"
    ];
  
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const wethContract = new ethers.Contract(WETH_ADDRESS, WETH_ABI, signer);
    console.log('1')
    const address = await signer.getAddress();
    console.log(2)
    const balance = await wethContract.balanceOf(address);
  
    console.log("WETH Balance:", ethers.utils.formatEther(balance));
   
    const tx = await wethContract.deposit({ value: ethers.utils.parseEther('0.1') });
    await tx.wait();
    console.log("ETH successfully wrapped to WETH!");
  };


      const uniswapRouterAbi = [
        {
          "name": "swapExactTokensForTokens",
          "type": "function",
          "stateMutability": "nonpayable",
          "outputs": [
            {
              "internalType": "uint256[]",
              "name": "amounts",
              "type": "uint256[]"
            }
          ],
          "inputs": [
            {
              "internalType": "uint256",
              "name": "amountIn",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "amountOutMin",
              "type": "uint256"
            },
            {
              "internalType": "address[]",
              "name": "path",
              "type": "address[]"
            },
            {
              "internalType": "address",
              "name": "to",
              "type": "address"
            },
            {
              "internalType": "uint256",
              "name": "deadline",
              "type": "uint256"
            }
          ]
        }
      ];
      

  const swapOnUniswap = async () => {
    const uniswapRouterAddress = "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D";
    const wethAddress = "0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6";
    const usdtAddress = "0x509ee0d083ddf8ac028f2a56731412edd63223b9";



  

       /* @ts-ignore */
  //     const contractRes = writeContract({
  //       abi: uniswapRouterAbi,
  //       address: uniswapRouterAddress,
  //       functionName: 'swapExactTokensForTokens',
  //       args: [
  //         ethers.utils.parseUnits("0.1", 18),
  //         0,
  //         [tokenA, tokenB],
  //         address,
  //         Math.floor(Date.now() / 1000) + 60 * 10
  //       ],
  //       gas: BigInt(300000),
  //     })

  //     console.log('contract res', contractRes);
  // }

  // const swapOnUniswap = async () => {
  //   try {
  //     console.log('click run')
  //     // if(window.ethereum === undefined) {
  //     //   return;
  //     // }
  //     // const provider = new ethers.providers.Web3Provider(window.ethereum);
  //     // const signer = provider.getSigner();

  //     // const tokenContract = new ethers.Contract(
  //     //   tokenA, // Address of the token you're swapping
  //     //   [
  //     //     "function approve(address spender, uint amount) public returns(bool)"
  //     //   ],
  //     //   signer
  //     // );
      
  //     // // Approve the contract to spend your tokens
  //     // const tx = await tokenContract.approve(uniswapFarmContractAddress, ethers.utils.parseUnits("100", 18));
  //     // await tx.wait();

  //     /* @ts-ignore */
  //     const contractRes = writeContract({
  //       abi: uniswapFarmAbi,
  //       address: uniswapFarmContractAddress,
  //       functionName: 'swap',
  //       args: [
  //         ethers.utils.parseUnits("0.1", 18),
  //         0,
  //         tokenA, 
  //         tokenB, 
  //         address
  //       ],
  //       gas: BigInt(300000),
  //     })

      
  
  // //  /* @ts-ignore */
  // //     const contractRes = writeContract({
  // //       abi: uniswapFarmAbi,
  // //       address: uniswapFarmContractAddress,
  // //       functionName: 'swap',
  // //       args: [
  // //         ethers.utils.parseUnits("0.1", 18),
  // //         0,
  // //         tokenA, 
  // //         tokenB, 
  // //         address
  // //       ],
  // //       gas: BigInt(300000),
  // //     })
  //     console.log('contract res', contractRes);
  //   } catch(err) {
  //     console.log('error', err);
  //     console.error('error', err);
  //     alert(err);
  //   }
  }


  // use this functon to wrap eth to weth
  // working
  const wrapEthToWethOnSeploia = async () => {
    try {
      const WETH_ADDRESS = '0x7b79995e5f793a07bc00c21412e50ecae098e7f9';
      const wethAbi = [
        {
          "constant": false,
          "inputs": [],
          "name": "deposit",
          "outputs": [],
          "payable": true,
          "stateMutability": "payable",
          "type": "function"
        }
      ];
  
      // @ts-ignore //
      const tx = await writeContract({
        address: WETH_ADDRESS,
        abi: wethAbi,
        functionName: 'deposit',
        value: BigInt(ethers.utils.parseEther('0.01').toString()), // Amount of ETH to wrap
      });
  
      console.log('tx', tx);
    } catch(err) {
      console.log('err', err);
    }

  }


  const uniswapV3Abi = [
    {
      "name": "exactInputSingle",
      "type": "function",
      "stateMutability": "payable",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "amountOut",
          "type": "uint256"
        }
      ],
      "inputs": [
        {
          "internalType": "tuple",
          "name": "params",
          "components": [
            {
              "internalType": "address",
              "name": "tokenIn",
              "type": "address"
            },
            {
              "internalType": "address",
              "name": "tokenOut",
              "type": "address"
            },
            {
              "internalType": "uint24",
              "name": "fee",
              "type": "uint24"
            },
            {
              "internalType": "address",
              "name": "recipient",
              "type": "address"
            },
            {
              "internalType": "uint256",
              "name": "deadline",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "amountIn",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "amountOutMinimum",
              "type": "uint256"
            },
            {
              "internalType": "uint160",
              "name": "sqrtPriceLimitX96",
              "type": "uint160"
            }
          ],
          "type": "tuple"
        }
      ]
    }
  ];
  


  const swapOnUniswapV3 = () => {

    const routerAddress = "0xE592427A0AEce92De3Edee1F18E0157C05861564";
  const tokenIn = "0x7b79995e5f793a07bc00c21412e50ecae098e7f9"; // WETH
  const tokenOut = "0x509ee0d083ddf8ac028f2a56731412edd63223b9"; // USDT
  const amountIn = ethers.utils.parseUnits("0.01", 18); // 0.01 WETH
  const feeTier = 3000;
  const deadline = Math.floor(Date.now() / 1000) + 60 * 10;
    console.clear()
  // @ts-ignore //
  const res = writeContract({
    address: routerAddress,
    abi: uniswapV3Abi,
    functionName: 'exactInputSingle',
    args: [{
      tokenIn,
      tokenOut,
      fee: feeTier,
      recipient: address,
      deadline,
      amountIn,
      amountOutMinimum: 0, // Accepting any amount of USDT
      sqrtPriceLimitX96: 0 // No price limit
    }],
  })

  console.log('res', res);

  }





  const swap = () => {
    console.clear()
    console.log('swap is called')
    const WETH_ADDRESS = '0x7b79995e5f793a07bc00c21412e50ecae098e7f9';
    const USDT_ADDRESS = '0x509ee0d083ddf8ac028f2a56731412edd63223b9';
    const UNISWAP_ROUTER_ADDRESS = '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D';

    const UNISWAP_V2_FACTORY_ADDRESS = '0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f';


    const wethAbi = [
      {
        "constant": false,
        "inputs": [
          { "internalType": "address", "name": "spender", "type": "address" },
          { "internalType": "uint256", "name": "amount", "type": "uint256" }
        ],
        "name": "approve",
        "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
        "stateMutability": "nonpayable",
        "type": "function"
      }
    ];
    const uniswapRouterAbi = [
      {
        "name": "swapExactTokensForTokens",
        "type": "function",
        "stateMutability": "nonpayable",
        "outputs": [
          {
            "internalType": "uint256[]",
            "name": "amounts",
            "type": "uint256[]"
          }
        ],
        "inputs": [
          {
            "internalType": "uint256",
            "name": "amountIn",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "amountOutMin",
            "type": "uint256"
          },
          {
            "internalType": "address[]",
            "name": "path",
            "type": "address[]"
          },
          {
            "internalType": "address",
            "name": "to",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "deadline",
            "type": "uint256"
          }
        ]
      }
    ];
    const amountIn = ethers.utils.parseEther('0.1');

    // @ts-ignore //
    // const approvalRes = writeContract({
    //   address: WETH_ADDRESS,
    //   abi: wethAbi,
    //   functionName: 'approve',
    //   args: [UNISWAP_ROUTER_ADDRESS, amountIn]
    // });
    // console.log('approve res', approvalRes); 
    // @ts-ignore //
    const swapRes = writeContract({
      address: UNISWAP_ROUTER_ADDRESS,
      abi: uniswapRouterAbi,
      functionName: 'swapExactTokensForTokens',
      args: [
        amountIn,                // amountIn
        0,                       // amountOutMin (0 for simplicity, but risky in production)
        [WETH_ADDRESS, USDT_ADDRESS], // Path: WETH -> USDT
        address,                 // Recipient
        Math.floor(Date.now() / 1000) + 60 * 10  // Deadline (10 mins from now)
      ]
    });
    console.log('swap res', swapRes);
  }

  useEffect(() => {
    console.log('new use effe running chain id', chainId)
    ;(async () => {
      const balance = await getBalanceFromWagmi()
      setBalance(balance ?? '0')
    })()
  }, [address, chainId])

  const dispatch = useAppDispatch()

  const {
    status,
    isSuccess: isTxSuccess,
    isError: isTxError,
  } = useWaitForTransactionReceipt({ hash: data })
  // console.log('confirmations', isTxError, status)

  useEffect(() => {
    ;(async () => {
      if (isTxSuccess) {
        const balance = await getBalanceFromWagmi()
        setBalance(balance ?? '0')
        dispatch(setTxInProgress(false))
        dispatch(
          setSnackbar({
            message: `Transaction successful. You staked ${depositAmount} tokens`,
            open: true,
            severity: 'success',
          }),
        )
        setDepositAmount('')
      }
    })()
  }, [isTxSuccess])

  // const onStake = useCallback(async () => {
  //   // console.clear()
  //   if (depositAmount > balance) {
  //     console.log('here check in the iff')
  //     dispatch(
  //       setSnackbar({
  //         message: 'Insufficient Balance',
  //         open: true,
  //         severity: 'error',
  //       }),
  //     )

  //     return
  //   }

  //   dispatch(setTxInProgress(true))

  //   // try {

  //   try {
  //     console.log('on stake chala', depositAmount)
  //     const amount: any = ethers.utils.parseEther(depositAmount)
  //     console.log('amount', amount)

  //     console.log('params', { address, amount, activeLockupOption })

  //     if (address && stakingManagerAbi && stakingManagerAddress) {
  //       /* @ts-ignore */
  //       const contractRes = await writeContractAsync({
  //         value: amount,
  //         abi: stakingManagerAbi,
  //         address: stakingManagerAddress,
  //         functionName: 'stake',
  //         args: [address, activeLockupOption],
  //         // gas: BigInt(74000),
  //       })
  //       console.log('contractRes', contractRes)
  //     }
  //   } catch (err) {
  //     // alert('tx failed in catch!')
  //     dispatch(
  //       setSnackbar({
  //         message: 'Transaction failed',
  //         open: true,
  //         severity: 'error',
  //       }),
  //     )
  //     dispatch(setTxInProgress(false))
  //     console.log('catch', err)
  //   } finally {
  //     // setDepositAmount('')
  //   }
  // }, [depositAmount])

  const setAmountWRTPercent = async (percent: number) => {
    // console.clear()

    const rpcUrl = 'https://rpca-vanguard.vanarchain.com'
    const provider = new ethers.providers.JsonRpcProvider(rpcUrl)

    const contract = new ethers.Contract(
      stakingManagerAddress,
      stakingManagerAbi,
      provider,
    )

    const res = await contract.estimateGas.stake(address, activeLockupOption, {
      value: ethers.utils.parseEther(balance),
    })
    const gas = 200000
    console.log('res', res.toString())

    const feeData: any = await provider.getFeeData()

    const gasPriceInEth: number = Number(
      ethers.utils.formatEther(feeData?.gasPrice?.toString()),
    )

    const totalGas = gas * gasPriceInEth

    const amountToStake = Number(balance) - totalGas
    // const gas: number = Number(formattedValue) * 2
    // const amountToStake = Number(balance) - gas
    setDepositAmount(amountToStake.toString())

    // console.log('estimateGas before')
    // if (Number(balance) > 0) {
    //   const amt = BigNumber(balance).div(100).multipliedBy(percent)
    //   console.log('balance')
    //   const floorAmount = Math.floor(Number(amt) * 10) / 10
    //   console.log('floorAmount', floorAmount)

    //   // const amtMinusGas = -1
    //   setDepositAmount(floorAmount.toString() || '')
    // }
  }

  const onStake = async () => {
    console.log('hello')
    try {
      const amount: any = ethers.utils.parseEther(depositAmount)
      /* @ts-ignore */
              const contractRes = writeContract({
              abi: farmingAbi,
              address: farmingContractAddress,
              functionName: 'stake',
              args: [amount],
              gas: BigInt(74000),
            })
    
            console.log('contractRes', contractRes);
    } catch(err) {
      alert('Tx failed')
      console.log('isError', isError)

    }
    finally {

      console.log('data', data);
    }


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
          onClick={onStake}
          // disabled={!depositAmount}
          // disabled={true}
        >
          Stake
        </Button>
      )
  }

  return (
    <Grid container>
      <InputContainer container minHeight={'140px'}>
        <Grid display={'flex'} justifyContent={'space-between'} width={'100%'}>
          <Typography color={'#F6F6F6'} fontSize={'16px'}>
            Stake Amount
          </Typography>

          <Grid display={'flex'} alignItems={'center'}>
            <img src={VanarToken} height={'18px'} />
            <Typography color={'#FFFFFF'} fontSize={'16px'} marginLeft={'2px'}>
              Toro
            </Typography>
          </Grid>
        </Grid>

        <Grid container alignItems={'center'} justifyContent={'space-between'}>
          <Input
            placeholder="0"
            value={depositAmount}
            onChange={e => {
              const formattedValue = validateAndFormatInput(e.target.value)
              setDepositAmount(formattedValue)
            }}
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
        </Grid>

        <Grid display={'flex'} justifyContent={'space-between'} width={'100%'}>
          <Typography
            color={'#F6F6F6'}
            fontSize={'16px'}
            sx={{ opacity: '0.5' }}
          >
            Balance:{BigNumber(balance).toFixed(4)}
          </Typography>

          <Grid display={'flex'} alignItems={'center'}>
            <Chip
              label="Max"
              sx={{ cursor: 'pointer' }}
              variant="filled"
              disabled={true}
              onClick={async () => await setAmountWRTPercent(100)}
            />
          </Grid>
        </Grid>
      </InputContainer>
        
        <Button onClick={swap} >Eth to Weth</Button>
      <Typography
        color={'#F6F6F6'}
        fontSize={'16px'}
        fontWeight={'500'}
        mt={'16px'}
      >
        Locking tokens for a longer time grants a higher share of staking
        rewards and governance rights
      </Typography>

      <Grid container justifyContent={'space-around'} mt={'15px'}>
        <Chip
          label="7D"
          sx={{ cursor: 'pointer', padding: '10px 20px' }}
          variant={activeLockupOption === 0 ? 'filled' : 'outlined'}
          onClick={() => setActiveLockupOption(0)}
        />
        <Chip
          label="30D"
          sx={{ cursor: 'pointer', padding: '10px 20px' }}
          variant={activeLockupOption === 1 ? 'filled' : 'outlined'}
          onClick={() => setActiveLockupOption(1)}
        />
        <Chip
          label="180D"
          sx={{ cursor: 'pointer', padding: '10px 20px' }}
          variant={activeLockupOption === 2 ? 'filled' : 'outlined'}
          onClick={() => setActiveLockupOption(2)}
        />
        <Chip
          label="2Y"
          sx={{ cursor: 'pointer', padding: '10px 20px' }}
          variant={activeLockupOption === 3 ? 'filled' : 'outlined'}
          onClick={() => setActiveLockupOption(3)}
        />
      </Grid>
      {/*      <Button onClick={swapOnUniswapV3} >Swap</Button> */}
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
        Your Reward Multiplier:{' '}
        <span style={{ color: '#03D9AF' }}>
          {activeLockupOption == 0
            ? '10'
            : activeLockupOption == 1
            ? '20'
            : activeLockupOption == 2
            ? '30'
            : '40'}
          %
        </span>
      </Typography>

      <RenderButton />
    </Grid>
  )
}

export default Stake
