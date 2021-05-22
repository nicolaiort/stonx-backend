import cron from 'node-cron';
import { getConnection } from 'typeorm';
import { CryptoWalletTimeSeries } from './models/entity/timeseries/CryptoWalletTimeSeries';
import { ExchangeAssetTimeSeries } from './models/entity/timeseries/ExchangeAssetTimeSeries';
import { User } from './models/entity/User';
import { SupportedExchanges } from './models/enums/SupportedExchanges';
import { ExchangeService } from './services/entity/ExchangeService';
import { TimeSeriesService } from './services/entity/TimeSeriesService';
import { UserService } from './services/entity/UserService';
import { WalletService } from './services/entity/WalletService';
import { BinanceService } from './services/utils/BinanceService';
import { BitpandaService } from './services/utils/BitpandaService';
import { GeckoService } from './services/utils/GeckoService';

export class TimeSeriesManager {

    private timeSeriesService: TimeSeriesService;
    private userService: UserService;
    private walletService: WalletService;
    private exchangeService: ExchangeService;

    constructor() {
        this.timeSeriesService = new TimeSeriesService();
        this.userService = getConnection().getCustomRepository(UserService);
        this.walletService = getConnection().getCustomRepository(WalletService);
        this.exchangeService = new ExchangeService();
    }

    public init() {
        this.collectData();
        this.scheduleQuaters();
    }

    private scheduleQuaters() {
        cron.schedule('0,15,30,45 * * * *', () => {
            this.collectData();
        });
    }

    private async collectData() {
        const timestamp: number = Date.now();
        const users = await this.userService.find({ relations: ['exchanges'] });
        for (const user of users) {
            this.collectUserData(user, timestamp);
        }
    }

    private async collectUserData(user: User, timestamp: number) {
        let promises = new Array<Promise<any>>();
        if (user.linkedExchanges.includes(SupportedExchanges.BITPANDA)) {
            promises.push(this.collectUserBitpandaData(user, timestamp));
        }
        if (user.linkedExchanges.includes(SupportedExchanges.BINANCE)) {
            promises.push(this.collectUserBinanceData(user, timestamp));
        }
        promises.push(this.collectUserWalletData(user, timestamp));

        const results = await Promise.all(promises);
        console.log(results.reduce((sum, curr) => { return sum += curr }, 0));
    }

    private async collectUserWalletData(user: User, timestamp: number) {
        let total_fiat: number = 0;
        for (const wallet of await this.walletService.findByUser(user)) {
            let balance = await wallet.balance();
            let fiat = await ((await GeckoService.getTokenPrice(wallet.token)) * balance)
            total_fiat += fiat;
            this.timeSeriesService.saveWalletDatapoint(new CryptoWalletTimeSeries(user, timestamp, balance, fiat, wallet.id, wallet.token));
        }
        return total_fiat;
    }

    private async collectUserBitpandaData(user: User, timestamp: number) {
        let total_fiat: number = 0;
        const config = await this.exchangeService.findBitpandaByUserOrFail(user);
        await BitpandaService.getWallets(config).then((wallets) => {
            for (const wallet of wallets) {
                total_fiat += wallet.fiat;
                this.timeSeriesService.saveExchangeDatapoint(new ExchangeAssetTimeSeries(user, timestamp, wallet.balance, wallet.fiat, SupportedExchanges.BITPANDA, wallet.token));
            }
        });
        await BitpandaService.getIndices(config).then((indices) => {
            for (const index of indices) {
                total_fiat += index.fiat;
                this.timeSeriesService.saveExchangeDatapoint(new ExchangeAssetTimeSeries(user, timestamp, index.balance, index.balance, SupportedExchanges.BITPANDA, index.token));
            }
        });
        return total_fiat;
    }

    private async collectUserBinanceData(user: User, timestamp: number) {
        let total_fiat: number = 0;
        const config = await this.exchangeService.findBinanceByUserOrFail(user);
        await BinanceService.getSpotWallets(config).then((wallets) => {
            for (const wallet of wallets) {
                this.timeSeriesService.saveExchangeDatapoint(new ExchangeAssetTimeSeries(user, timestamp, wallet.balance, wallet.fiat, SupportedExchanges.BINANCE, wallet.token));
                total_fiat += wallet.fiat;
            }
        });
        return total_fiat;
    }
}