import { Controller, Sse } from '@nestjs/common';
import { MarketService } from './market.service';
import { interval, Observable, switchMap } from 'rxjs';

@Controller('market')
export class MarketController {
  constructor(private readonly marketService: MarketService) {}

  @Sse('stream')
  streamCryptoRates(): Observable<any> {
    return interval(1000).pipe(
      switchMap(async () => {
        const cryptoData = await this.marketService.getCryptoRatesFromRedis();
        return { data: cryptoData }; // Send the processed data to the frontend
      }),
    );
  }
}
