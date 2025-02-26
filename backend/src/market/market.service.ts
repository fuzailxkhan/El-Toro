import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRedis } from '@nestjs-modules/ioredis';
import { Redis } from 'ioredis';
import axios from 'axios';

export interface CryptoInterface {
  id: string; // Symbol (e.g., BTCUSDT)
  name: string; // Base asset name (e.g., BTC)
  current_price: number; // Last price
  market_cap: number; // Calculated market cap
  total_volume: number; // Volume in base asset
  price_change_percentage_24h: number; // Calculated 24h change
}

@Injectable()
export class MarketService {
  private readonly logger = new Logger(MarketService.name);
  private readonly binanceApiUrl =
    'https://www.binance.com/bapi/asset/v2/public/asset-service/product/get-products?includeEtf=true';
  private readonly CACHE_KEY = 'crypto-market-data';
  private readonly CACHE_TTL = 1; // 1 minute in seconds

  constructor(@InjectRedis() private readonly redis: Redis) {}

  @Cron(CronExpression.EVERY_SECOND)
  async fetchCryptoRates(): Promise<void> {
    try {
      const cryptoData = await this.getCryptoData();
      if (cryptoData.length > 0) {
        // Save data to Redis
        await this.redis.set(
          this.CACHE_KEY,
          JSON.stringify(cryptoData),
          'EX',
          this.CACHE_TTL,
        );
        this.logger.log('Crypto market data updated successfully in Redis.');
      } else {
        this.logger.warn('No data processed from Binance API.');
      }
    } catch (error) {
      this.logger.error(`Error fetching crypto market data: ${error.message}`);
    }
  }

  async getCryptoRatesFromRedis(): Promise<CryptoInterface[]> {
    try {
      const data = await this.redis.get(this.CACHE_KEY);
      if (!data) {
        this.logger.warn('Cache is empty. Fetching fresh data.');
        return await this.getCryptoData();
      }
      return JSON.parse(data) as CryptoInterface[];
    } catch (error) {
      this.logger.error(
        `Error retrieving crypto market data from Redis: ${error.message}`,
      );
      throw new HttpException(
        'Failed to retrieve crypto market data',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getCryptoData(): Promise<CryptoInterface[]> {
    try {
      const response = await axios.get(this.binanceApiUrl);

      if (response.data && Array.isArray(response.data.data)) {
        const tokensOfInterest = [
          'BTC',
          'ETH',
          'XRP',
          'USDT',
          'SOL',
          'BNB',
          'USDC',
          'DOGE',
          'ADA',
          'TRX',
          'UNI'
        ];

        // Filter for tokens with USDT pair and calculate fields
        const processedData = response.data.data
          .filter((token: any) => tokensOfInterest.includes(token.b) && token.q === 'USDT')
          .map((token: any) => ({
            id: token.s, // Symbol (e.g., BTCUSDT)
            name: token.b, // Base asset name (e.g., BTC)
            current_price: parseFloat(token.c), // Last price
            market_cap: token.cs
              ? parseFloat(token.o) * parseFloat(token.cs) // Open price * Circulating supply
              : 0,
            total_volume: parseFloat(token.v), // Volume in base asset
            price_change_percentage_24h:
              ((parseFloat(token.c) - parseFloat(token.o)) /
                parseFloat(token.o)) *
              100, // (Current - Open) / Open * 100
          }));

        return processedData;
      } else {
        this.logger.warn('Unexpected response data format from Binance API.');
        return [];
      }
    } catch (error) {
      this.logger.error(`Failed to fetch crypto data: ${error.message}`);
      throw new HttpException(
        'Failed to fetch crypto data from Binance',
        HttpStatus.BAD_GATEWAY,
      );
    }
  }
}
