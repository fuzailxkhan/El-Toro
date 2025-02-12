import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class MarketService {
    private readonly coingeckoBaseUrl = 'https://api.coingecko.com/api/v3';

  async getCryptoData(): Promise<any> {
    try {
      const response = await axios.get(`${this.coingeckoBaseUrl}/coins/markets`, {
        params: {
          vs_currency: 'usd', // Fetch data in USD
          order: 'market_cap_desc', // Sort by market cap
          per_page: 10, // Limit to top 10 coins
          page: 1,
          sparkline: false, // Exclude sparkline data
        },
      });
      console.log("Coin Gecko Response =>" , response)
      return response.data;
    } catch (error) {
      throw new HttpException(
        'Failed to fetch crypto data from CoinGecko',
        HttpStatus.BAD_GATEWAY,
      );
    }
  }
}
