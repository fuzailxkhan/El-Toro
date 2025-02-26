import { useCallback, useEffect, useState } from "react";

import { Button, Grid, Input, Typography } from "@mui/material";
import { VanarToken } from "@assets/index";
import WalletButtons from "@components/WalletButtons";
import { ConnectionType } from "../../connection";
import {
  useAccount,
  useWriteContract,
} from "wagmi";
import { farmingAbi, farmingContractAddress } from "./contract";
import { InputContainer } from '@pages/Home/styles'

const Reward = () => {
  const { address, isConnecting, isDisconnected, isConnected } = useAccount();

  const { writeContract } = useWriteContract();

  const onRewardClaim = () => {
    /* @ts-ignore */
    const contractRes = writeContract({
      abi: farmingAbi,
      address: farmingContractAddress,
      functionName: "claimReward",
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
          onClick={onRewardClaim}
        >
          Claim
        </Button>
      );
  };

  return (
    <Grid container>
      <InputContainer container minHeight={"140px"}>
        <Grid display={"flex"} justifyContent={"space-between"} width={"100%"}>
          <Typography color={"#F6F6F6"} fontSize={"16px"}>
            Claim Rewards
          </Typography>

          <Grid display={"flex"} alignItems={"center"}>
            <img src={VanarToken} height={"18px"} />
            <Typography color={"#FFFFFF"} fontSize={"16px"} marginLeft={"2px"}>
              Toro
            </Typography>
          </Grid>
        </Grid>
      </InputContainer>

      <RenderButton />
    </Grid>
  );
};

export default Reward;
