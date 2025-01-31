import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction } from './entities/transactions.entities';
import { CreateTransactionDto } from './dto/create-transactions.dto';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
  ) {}

  async create(createTransactionDto: CreateTransactionDto) {
    const transaction = this.transactionRepository.create(createTransactionDto);
    return await this.transactionRepository.save(transaction);
  }

  async findAll() {
    return await this.transactionRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findByUser(metaMaskAddress: string) {
    return await this.transactionRepository.find({
      where: { metaMaskAddress },
      order: { createdAt: 'DESC' },
    });
  }
}
