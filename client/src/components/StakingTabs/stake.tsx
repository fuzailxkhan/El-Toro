// @ts-nocheck //
import { useEffect, useState } from "react";
import { Button, Chip, Grid, Input, Typography } from "@mui/material";
import { useAppDispatch } from "@hooks/";
import { setTxInProgress } from "@redux/slices/walletSlice";
import { setSnackbar } from "@redux/slices/themeSlice";
import { ethers } from "ethers";
import BigNumber from "bignumber.js";
import { VanarToken } from "@assets/index";
import { InputContainer } from "@pages/Home/styles";
import WalletButtons from "@components/WalletButtons";
import { ConnectionType } from "../../connection";
import { validateAndFormatInput } from "@utils/index";
import {
  useAccount,
  useWriteContract,
  useChainId,
  useWaitForTransactionReceipt,
  useReadContract,
  useSwitchChain,
  useBalance,
} from "wagmi";
import { useWeb3Modal } from "@web3modal/wagmi/react";
import { Address, createPublicClient, erc20Abi } from "viem";
import { farmingAbi, farmingContractAddress } from "./contract";

const Stake = () => {
  const [depositAmount, setDepositAmount] = useState("");

  const [balance, setBalance] = useState("0");

  const chainId = useChainId();
  const { chains, switchChain } = useSwitchChain();

  const { address, isConnecting, isDisconnected, isConnected } = useAccount();

  const {
    writeContract,
    data,
    isError,
    writeContractAsync,
    isPending,
    isSuccess,
  } = useWriteContract();

  const { data: toroBalance, refetch }: any = useReadContract({
    abi: erc20Abi,
    address: "0xceC1613c976C81A997175004CA20D0ED698C0979",
    functionName: "balanceOf",
    args: [address],
  });

  useEffect(() => {
    console.log("stake chain id", chainId);
    if (chainId !== 17000) {
      switchChain({ chainId: 17000 });
    }
  }, []);

  const { data: ethBalance, refetch: refetchEthBalance } = useBalance({
    address,
    chainId: 17000, // Holesky Chain ID
  });

  const {
    status,
    isSuccess: isTxSuccess,
    isError: isTxError,
  } = useWaitForTransactionReceipt({ hash: data });

  useEffect(() => {
    if(ethBalance) {
      console.log('eth balance', ethBalance.formatted);
      setBalance(ethBalance.formatted);
    }
  }, [address, ethBalance])

  const onStake = async () => {
    console.log("hello");
    try {
      const amount: any = ethers.utils.parseEther(depositAmount);
      /* @ts-ignore */
      const contractRes = writeContract({
        abi: farmingAbi,
        address: farmingContractAddress,
        functionName: "stake",
        args: [amount],
        gas: BigInt(94000),
      });

      console.log("contractRes", contractRes);
    } catch (err) {
      alert("Tx failed");
      console.log("isError", isError);
    } finally {
      console.log("data", data);
      refetch();
    }
  };

  const RenderButton = () => {
    if (!address)
      return (
        <WalletButtons
          wallets={[ConnectionType.INJECTED, ConnectionType.WALLET_CONNECT]}
          fullWidth
        />
      );
    else
      return (
        <Button
          variant="contained"
          sx={{
            height: "60px",
            borderRadius: "100px",
            width: "100%",
            marginTop: "15px",
          }}
          onClick={onStake}
        >
          Stake
        </Button>
      );
  };

  return (
    <Grid container>
      <InputContainer container minHeight={"140px"}>
        <Grid display={"flex"} justifyContent={"space-between"} width={"100%"}>
          <Typography color={"#F6F6F6"} fontSize={"16px"}>
            Stake Amount
          </Typography>

          <Grid display={"flex"} alignItems={"center"}>
            <img src={VanarToken} height={"18px"} />
            <Typography color={"#FFFFFF"} fontSize={"16px"} marginLeft={"2px"}>
              Toro
            </Typography>
          </Grid>
        </Grid>

        <Grid container alignItems={"center"} justifyContent={"space-between"}>
          <Input
            placeholder="0"
            value={depositAmount}
            onChange={(e) => {
              const formattedValue = validateAndFormatInput(e.target.value);
              setDepositAmount(formattedValue);
            }}
            onKeyDown={(e) => {
              if (e.key === "e" || e.key === "-" || e.key === "+") {
                e.preventDefault();
              }
            }}
            disableUnderline
            type="number"
            sx={{
              width: "100%",
            }}
          />
        </Grid>

        <Grid display={"flex"} justifyContent={"space-between"} width={"100%"}>
          <Typography
            color={"#F6F6F6"}
            fontSize={"16px"}
            sx={{ opacity: "0.5" }}
          >
            Balance Eth: {BigNumber(balance).toFixed(4)}
          </Typography>
        </Grid>
        {toroBalance && (
          <Typography
            color={"#F6F6F6"}
            fontSize={"16px"}
            sx={{ opacity: "0.5" }}
          >
            Balance Toro: {ethers.utils.formatEther(toroBalance)}
          </Typography>
        )}
      </InputContainer>

      <Typography
        color={"#F6F6F6"}
        fontSize={"16px"}
        fontWeight={"700"}
        textAlign={"center"}
        width={"100%"}
        mt={"15px"}
        mb={"15px"}
      >
        Your Reward Multiplier: <span style={{ color: "#03D9AF" }}>1%</span>
      </Typography>

      <RenderButton />
    </Grid>
  );
};

export default Stake;
