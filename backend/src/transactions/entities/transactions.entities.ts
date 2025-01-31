import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 42 })
  metaMaskAddress: string;

  @Column({ type: 'varchar', unique: true })
  transactionHash: string;

  @Column({ type: 'decimal', precision: 18, scale: 8 })
  amount: number;

  @Column({ type: 'varchar', length: 42 })
  contractAddress: string;

  @Column({ type: 'varchar', length: 42 })
  tokenAddress: string;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;
}
