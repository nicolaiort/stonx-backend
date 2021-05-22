import cron from 'node-cron';
import { getConnection } from 'typeorm';
import { CryptoWallet } from './models/entity/CryptoWallet';
import { ExchangeAssetTimeSeries } from './models/entity/timeseries/ExchangeAssetTimeSeries';
import { User } from './models/entity/User';
import { SupportedExchanges } from './models/enums/SupportedExchanges';
import { ExchangeService } from './services/entity/ExchangeService';
import { TimeSeriesService } from './services/entity/TimeSeriesService';
import { UserService } from './services/entity/UserService';
import { WalletService } from './services/entity/WalletService';
import { BinanceService } from './services/utils/BinanceService';
import { BitpandaService } from './services/utils/BitpandaService';

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
        // this.scheduleQuaters();
        this.collectData();
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
        console.log(`Collecting data for user ${user.username}`)
        if (user.linkedExchanges.includes(SupportedExchanges.BITPANDA)) {
            this.collectUserBitpandaData(user, timestamp);
        }
        if (user.linkedExchanges.includes(SupportedExchanges.BINANCE)) {
            this.collectUserBinanceData(user, timestamp);
        }
        for (const wallet of await this.walletService.findByUser(user)) {

        }
    }

    private async collectUserWalletData(wallet: CryptoWallet, timestamp: number) {
        //TODO:
    }

    private async collectUserBitpandaData(user: User, timestamp: number) {
        console.log(`Collecting bitpanda data for user ${user.username}`)
        const config = await this.exchangeService.findBitpandaByUserOrFail(user);
        BitpandaService.getWallets(config).then((wallets) => {
            for (const wallet of wallets) {
                this.timeSeriesService.saveExchangeDatapoint(new ExchangeAssetTimeSeries(user, timestamp, wallet.balance, wallet.fiat, SupportedExchanges.BITPANDA, wallet.token));
            }
        });
        BitpandaService.getIndices(config).then((indices) => {
            for (const index of indices) {
                this.timeSeriesService.saveExchangeDatapoint(new ExchangeAssetTimeSeries(user, timestamp, index.balance, index.balance, SupportedExchanges.BITPANDA, index.token));
            }
        });
    }

    private async collectUserBinanceData(user: User, timestamp: number) {
        console.log(`Collecting binance data for user ${user.username}`)
        const config = await this.exchangeService.findBinanceByUserOrFail(user);
        BinanceService.getSpotWallets(config.binance_api_key, config.binance_api_secret).then((wallets) => {
            for (const wallet of wallets) {
                this.timeSeriesService.saveExchangeDatapoint(new ExchangeAssetTimeSeries(user, timestamp, wallet.balance, wallet.fiat, SupportedExchanges.BINANCE, wallet.token));
            }
        });
    }
}