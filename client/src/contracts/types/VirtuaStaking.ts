/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import {
  BaseContract,
  BigNumber,
  BigNumberish,
  BytesLike,
  CallOverrides,
  ContractTransaction,
  Overrides,
  PayableOverrides,
  PopulatedTransaction,
  Signer,
  utils,
} from "ethers";
import { FunctionFragment, Result, EventFragment } from "@ethersproject/abi";
import { Listener, Provider } from "@ethersproject/providers";
import { TypedEventFilter, TypedEvent, TypedListener, OnEvent } from "./common";

export interface VirtuaStakingInterface extends utils.Interface {
  functions: {
    "batchStake(address[],uint256[],uint256[])": FunctionFragment;
    "boostedPool()": FunctionFragment;
    "claimReward()": FunctionFragment;
    "deductionValue()": FunctionFragment;
    "owner()": FunctionFragment;
    "paused()": FunctionFragment;
    "renounceOwnership()": FunctionFragment;
    "rewardPool()": FunctionFragment;
    "setDatabase(address)": FunctionFragment;
    "setReward(address)": FunctionFragment;
    "setWithdrawFees(uint256)": FunctionFragment;
    "stake(address,uint8)": FunctionFragment;
    "stakingDatabase()": FunctionFragment;
    "totalStakedAmount()": FunctionFragment;
    "transferOwnership(address)": FunctionFragment;
    "unstake(uint256)": FunctionFragment;
    "withdrawFees()": FunctionFragment;
  };

  encodeFunctionData(
    functionFragment: "batchStake",
    values: [string[], BigNumberish[], BigNumberish[]]
  ): string;
  encodeFunctionData(
    functionFragment: "boostedPool",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "claimReward",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "deductionValue",
    values?: undefined
  ): string;
  encodeFunctionData(functionFragment: "owner", values?: undefined): string;
  encodeFunctionData(functionFragment: "paused", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "renounceOwnership",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "rewardPool",
    values?: undefined
  ): string;
  encodeFunctionData(functionFragment: "setDatabase", values: [string]): string;
  encodeFunctionData(functionFragment: "setReward", values: [string]): string;
  encodeFunctionData(
    functionFragment: "setWithdrawFees",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "stake",
    values: [string, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "stakingDatabase",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "totalStakedAmount",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "transferOwnership",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "unstake",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "withdrawFees",
    values?: undefined
  ): string;

  decodeFunctionResult(functionFragment: "batchStake", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "boostedPool",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "claimReward",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "deductionValue",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "owner", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "paused", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "renounceOwnership",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "rewardPool", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "setDatabase",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "setReward", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "setWithdrawFees",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "stake", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "stakingDatabase",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "totalStakedAmount",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "transferOwnership",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "unstake", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "withdrawFees",
    data: BytesLike
  ): Result;

  events: {
    "OwnershipTransferred(address,address)": EventFragment;
    "Paused(address)": EventFragment;
    "RewardClaimed(uint256,uint256,uint256,address)": EventFragment;
    "Staked(uint256,uint256,address)": EventFragment;
    "Unpaused(address)": EventFragment;
    "Unstaked(uint256,uint256,uint256,address)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "OwnershipTransferred"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "Paused"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "RewardClaimed"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "Staked"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "Unpaused"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "Unstaked"): EventFragment;
}

export type OwnershipTransferredEvent = TypedEvent<
  [string, string],
  { previousOwner: string; newOwner: string }
>;

export type OwnershipTransferredEventFilter =
  TypedEventFilter<OwnershipTransferredEvent>;

export type PausedEvent = TypedEvent<[string], { account: string }>;

export type PausedEventFilter = TypedEventFilter<PausedEvent>;

export type RewardClaimedEvent = TypedEvent<
  [BigNumber, BigNumber, BigNumber, string],
  {
    amount: BigNumber;
    boostedReward: BigNumber;
    timestamp: BigNumber;
    staker: string;
  }
>;

export type RewardClaimedEventFilter = TypedEventFilter<RewardClaimedEvent>;

export type StakedEvent = TypedEvent<
  [BigNumber, BigNumber, string],
  { amount: BigNumber; timestamp: BigNumber; staker: string }
>;

export type StakedEventFilter = TypedEventFilter<StakedEvent>;

export type UnpausedEvent = TypedEvent<[string], { account: string }>;

export type UnpausedEventFilter = TypedEventFilter<UnpausedEvent>;

export type UnstakedEvent = TypedEvent<
  [BigNumber, BigNumber, BigNumber, string],
  {
    amount: BigNumber;
    boostedReward: BigNumber;
    timestamp: BigNumber;
    staker: string;
  }
>;

export type UnstakedEventFilter = TypedEventFilter<UnstakedEvent>;

export interface VirtuaStaking extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: VirtuaStakingInterface;

  queryFilter<TEvent extends TypedEvent>(
    event: TypedEventFilter<TEvent>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TEvent>>;

  listeners<TEvent extends TypedEvent>(
    eventFilter?: TypedEventFilter<TEvent>
  ): Array<TypedListener<TEvent>>;
  listeners(eventName?: string): Array<Listener>;
  removeAllListeners<TEvent extends TypedEvent>(
    eventFilter: TypedEventFilter<TEvent>
  ): this;
  removeAllListeners(eventName?: string): this;
  off: OnEvent<this>;
  on: OnEvent<this>;
  once: OnEvent<this>;
  removeListener: OnEvent<this>;

  functions: {
    batchStake(
      _beneficiaries: string[],
      _amounts: BigNumberish[],
      _duration: BigNumberish[],
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    boostedPool(overrides?: CallOverrides): Promise<[string]>;

    claimReward(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    deductionValue(overrides?: CallOverrides): Promise<[BigNumber]>;

    owner(overrides?: CallOverrides): Promise<[string]>;

    paused(overrides?: CallOverrides): Promise<[boolean]>;

    renounceOwnership(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    rewardPool(overrides?: CallOverrides): Promise<[string]>;

    setDatabase(
      _database: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    setReward(
      _rewardPool: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    setWithdrawFees(
      _fees: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    stake(
      _benifactor: string,
      _duration: BigNumberish,
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    stakingDatabase(overrides?: CallOverrides): Promise<[string]>;

    totalStakedAmount(overrides?: CallOverrides): Promise<[BigNumber]>;

    transferOwnership(
      newOwner: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    unstake(
      _amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    withdrawFees(overrides?: CallOverrides): Promise<[BigNumber]>;
  };

  batchStake(
    _beneficiaries: string[],
    _amounts: BigNumberish[],
    _duration: BigNumberish[],
    overrides?: PayableOverrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  boostedPool(overrides?: CallOverrides): Promise<string>;

  claimReward(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  deductionValue(overrides?: CallOverrides): Promise<BigNumber>;

  owner(overrides?: CallOverrides): Promise<string>;

  paused(overrides?: CallOverrides): Promise<boolean>;

  renounceOwnership(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  rewardPool(overrides?: CallOverrides): Promise<string>;

  setDatabase(
    _database: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  setReward(
    _rewardPool: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  setWithdrawFees(
    _fees: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  stake(
    _benifactor: string,
    _duration: BigNumberish,
    overrides?: PayableOverrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  stakingDatabase(overrides?: CallOverrides): Promise<string>;

  totalStakedAmount(overrides?: CallOverrides): Promise<BigNumber>;

  transferOwnership(
    newOwner: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  unstake(
    _amount: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  withdrawFees(overrides?: CallOverrides): Promise<BigNumber>;

  callStatic: {
    batchStake(
      _beneficiaries: string[],
      _amounts: BigNumberish[],
      _duration: BigNumberish[],
      overrides?: CallOverrides
    ): Promise<void>;

    boostedPool(overrides?: CallOverrides): Promise<string>;

    claimReward(overrides?: CallOverrides): Promise<void>;

    deductionValue(overrides?: CallOverrides): Promise<BigNumber>;

    owner(overrides?: CallOverrides): Promise<string>;

    paused(overrides?: CallOverrides): Promise<boolean>;

    renounceOwnership(overrides?: CallOverrides): Promise<void>;

    rewardPool(overrides?: CallOverrides): Promise<string>;

    setDatabase(_database: string, overrides?: CallOverrides): Promise<void>;

    setReward(_rewardPool: string, overrides?: CallOverrides): Promise<void>;

    setWithdrawFees(
      _fees: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    stake(
      _benifactor: string,
      _duration: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    stakingDatabase(overrides?: CallOverrides): Promise<string>;

    totalStakedAmount(overrides?: CallOverrides): Promise<BigNumber>;

    transferOwnership(
      newOwner: string,
      overrides?: CallOverrides
    ): Promise<void>;

    unstake(_amount: BigNumberish, overrides?: CallOverrides): Promise<void>;

    withdrawFees(overrides?: CallOverrides): Promise<BigNumber>;
  };

  filters: {
    "OwnershipTransferred(address,address)"(
      previousOwner?: string | null,
      newOwner?: string | null
    ): OwnershipTransferredEventFilter;
    OwnershipTransferred(
      previousOwner?: string | null,
      newOwner?: string | null
    ): OwnershipTransferredEventFilter;

    "Paused(address)"(account?: null): PausedEventFilter;
    Paused(account?: null): PausedEventFilter;

    "RewardClaimed(uint256,uint256,uint256,address)"(
      amount?: null,
      boostedReward?: null,
      timestamp?: null,
      staker?: null
    ): RewardClaimedEventFilter;
    RewardClaimed(
      amount?: null,
      boostedReward?: null,
      timestamp?: null,
      staker?: null
    ): RewardClaimedEventFilter;

    "Staked(uint256,uint256,address)"(
      amount?: null,
      timestamp?: null,
      staker?: null
    ): StakedEventFilter;
    Staked(amount?: null, timestamp?: null, staker?: null): StakedEventFilter;

    "Unpaused(address)"(account?: null): UnpausedEventFilter;
    Unpaused(account?: null): UnpausedEventFilter;

    "Unstaked(uint256,uint256,uint256,address)"(
      amount?: null,
      boostedReward?: null,
      timestamp?: null,
      staker?: null
    ): UnstakedEventFilter;
    Unstaked(
      amount?: null,
      boostedReward?: null,
      timestamp?: null,
      staker?: null
    ): UnstakedEventFilter;
  };

  estimateGas: {
    batchStake(
      _beneficiaries: string[],
      _amounts: BigNumberish[],
      _duration: BigNumberish[],
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    boostedPool(overrides?: CallOverrides): Promise<BigNumber>;

    claimReward(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    deductionValue(overrides?: CallOverrides): Promise<BigNumber>;

    owner(overrides?: CallOverrides): Promise<BigNumber>;

    paused(overrides?: CallOverrides): Promise<BigNumber>;

    renounceOwnership(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    rewardPool(overrides?: CallOverrides): Promise<BigNumber>;

    setDatabase(
      _database: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    setReward(
      _rewardPool: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    setWithdrawFees(
      _fees: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    stake(
      _benifactor: string,
      _duration: BigNumberish,
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    stakingDatabase(overrides?: CallOverrides): Promise<BigNumber>;

    totalStakedAmount(overrides?: CallOverrides): Promise<BigNumber>;

    transferOwnership(
      newOwner: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    unstake(
      _amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    withdrawFees(overrides?: CallOverrides): Promise<BigNumber>;
  };

  populateTransaction: {
    batchStake(
      _beneficiaries: string[],
      _amounts: BigNumberish[],
      _duration: BigNumberish[],
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    boostedPool(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    claimReward(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    deductionValue(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    owner(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    paused(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    renounceOwnership(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    rewardPool(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    setDatabase(
      _database: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    setReward(
      _rewardPool: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    setWithdrawFees(
      _fees: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    stake(
      _benifactor: string,
      _duration: BigNumberish,
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    stakingDatabase(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    totalStakedAmount(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    transferOwnership(
      newOwner: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    unstake(
      _amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    withdrawFees(overrides?: CallOverrides): Promise<PopulatedTransaction>;
  };
}
