import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRedis } from '@nestjs-modules/ioredis';
import { Redis } from 'ioredis';
import axios from 'axios';

export interface CryptoInterface {
  id: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  total_volume: number;
  price_change_percentage_24h: number;
}

@Injectable()
export class MarketService {
  private readonly logger = new Logger(MarketService.name);
  private readonly coingeckoBaseUrl = 'https://api.coingecko.com/api/v3';
  private readonly CACHE_KEY = 'crypto-rates';
  private readonly CACHE_TTL = 300; // 5 minutes in seconds

  constructor(@InjectRedis() private readonly redis: Redis) {}

  @Cron(CronExpression.EVERY_MINUTE)
  async fetchCryptoRates(): Promise<void> {
    try {
      const cryptoData = await this.getCryptoData();
      console.log(cryptoData[0].name+'   ====>  '+cryptoData[0].current_price  )
      if (cryptoData.length > 0) {
        // Save data to Redis
        await this.redis.setex(
          this.CACHE_KEY,
          this.CACHE_TTL,
          JSON.stringify(cryptoData),
        );
        this.logger.log('Crypto rates updated successfully in Redis.');
      } else {
        this.logger.warn('No data received from CoinGecko API.');
      }
    } catch (error) {
      this.logger.error(`Error fetching crypto rates: ${error.message}`);
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
        `Error retrieving crypto rates from Redis: ${error.message}`,
      );
      throw new HttpException(
        'Failed to retrieve crypto rates',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getCryptoData(): Promise<CryptoInterface[]> {
    try {
      const response = await axios.get(`${this.coingeckoBaseUrl}/coins/markets`, {
        headers: {
          'x-cg-demo-api-key': 'CG-ZtUcUjv9LWbACKwGorKfc7jj', // Replace with your valid API key if necessary
        },
        params: {
          vs_currency: 'usd',
          order: 'market_cap_desc',
          per_page: 10,
          page: 1,
          sparkline: false,
        },
      });

      if (response.data && Array.isArray(response.data)) {
        return response.data.map((coin: any) => ({
          id: coin.id,
          name: coin.name,
          image: coin.image,
          current_price: coin.current_price,
          market_cap: coin.market_cap,
          total_volume: coin.total_volume,
          price_change_percentage_24h: coin.price_change_percentage_24h,
        }));
      } else {
        this.logger.warn('Unexpected response data format from CoinGecko API.');
        return [];
      }
    } catch (error) {
      this.logger.error(`Failed to fetch crypto data: ${error.message}`);
      throw new HttpException(
        'Failed to fetch crypto data from CoinGecko',
        HttpStatus.BAD_GATEWAY,
      );
    }
  }
}
