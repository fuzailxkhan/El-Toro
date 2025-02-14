import { Controller, Get, Sse } from '@nestjs/common';
import { MarketService } from './market.service';
import { interval, map, Observable, switchMap } from 'rxjs';


@Controller('market')
export class MarketController {
    constructor(private readonly marketService: MarketService) {}

    @Get('data')
    async getCryptoData() {
      return this.marketService.getCryptoData();
    }

    @Sse('stream')
    streamCryptoRates(): Observable<any> {
        return interval(1000).pipe(
            switchMap(async () => {
                // Fetch the latest crypto data from Redis
                const cryptoData = await this.marketService.getCryptoRatesFromRedis();
                return { data: cryptoData }; // Send the filtered data
            }),
        );
    }

}
