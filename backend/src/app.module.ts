import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TransactionsModule } from './transactions/transactions.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Transaction } from './transactions/entities/transactions.entities';
import { MarketModule } from './market/market.module';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Makes .env variables available everywhere
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DATABASE_HOST'),
        port: configService.get<number>('DATABASE_PORT'),
        username: configService.get<string>('DATABASE_USER'),
        password: configService.get<string>('DATABASE_PASSWORD'),
        database: configService.get<string>('DATABASE_NAME'),
        entities: [Transaction], // Add entities here
        synchronize: true, // Auto-create tables (disable in production)
      }),
    }),
    TransactionsModule,
     MarketModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
