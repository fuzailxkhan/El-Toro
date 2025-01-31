import { IsNotEmpty, IsString, IsEthereumAddress, IsNumber } from 'class-validator';

export class CreateTransactionDto {
  @IsNotEmpty()
  @IsEthereumAddress()
  metaMaskAddress: string;

  @IsNotEmpty()
  @IsString()
  transactionHash: string;

  @IsNotEmpty()
  @IsNumber()
  amount: number;

  @IsNotEmpty()
  @IsEthereumAddress()
  contractAddress: string;

  @IsNotEmpty()
  @IsEthereumAddress()
  tokenAddress: string;
}
