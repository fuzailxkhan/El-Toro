import { useCallback, useEffect, useState } from "react";

import { Button, Chip, Grid, Input, Typography } from "@mui/material";
import { ethers } from "ethers";
import { VanarToken } from "@assets/index";
import { InputContainer } from "@pages/Home/styles";
import { validateAndFormatInput } from "@utils/index";
import WalletButtons from "@components/WalletButtons";
import { ConnectionType } from "../../connection";
import {
  useAccount,
  useWriteContract,
  useReadContract,
  useChainId,
  useTransactionConfirmations,
  useWaitForTransactionReceipt,
} from "wagmi";
import { farmingAbi, farmingContractAddress } from "./contract";

const Unstake = () => {
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const { writeContract } = useWriteContract();

  const chainId = useChainId();

  const { address, isConnecting, isDisconnected, isConnected } = useAccount();

  /* @ts-ignore */
  const { refetch: refetchStakedAmount, data: stakedAmount } = useReadContract({
    abi: farmingAbi,
    address: farmingContractAddress,
    functionName: "stakedAmounts",
    args: [address?.toLowerCase() as `0x${string}`],
  });

  const onWithDraw = () => {
    const amount: any = ethers.utils.parseEther(withdrawAmount);

    /* @ts-ignore */
    const contractRes = writeContract({
      abi: farmingAbi,
      address: farmingContractAddress,
      functionName: "unstake",
      args: [amount],
      gas: BigInt(74000),
    });
    console.log("contract res", contractRes);
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
            marginTop: "50px",
          }}
          onClick={onWithDraw}
          // disabled={true}
          // disabled={disableButton}
        >
          Withdraw
        </Button>
      );
  };

  return (
    <Grid container>
      <InputContainer container minHeight={"140px"}>
        <Grid display={"flex"} justifyContent={"space-between"} width={"100%"}>
          <Typography color={"#F6F6F6"} fontSize={"16px"}>
            Unstake
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
            value={withdrawAmount}
            onChange={(e) => {
              const formattedValue = validateAndFormatInput(e.target.value);
              setWithdrawAmount(formattedValue);
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
            Staked Amount:{" "}
            {stakedAmount && ethers.utils.formatEther(stakedAmount.toString())}
          </Typography>
        </Grid>
      </InputContainer>

      <RenderButton />
    </Grid>
  );
};

export default Unstake;
