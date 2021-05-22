import cron from 'node-cron';
import { CryptoWallet } from './models/entity/CryptoWallet';
import { User } from './models/entity/User';
import { SupportedExchanges } from './models/enums/SupportedExchanges';
import { TimeSeriesService } from './services/entity/TimeSeriesService';
import { UserService } from './services/entity/UserService';
import { WalletService } from './services/entity/WalletService';

export class TimeSeriesManager {

    private timeSeriesService: TimeSeriesService;
    private userService: UserService;
    private walletService: WalletService;

    constructor() {
        this.timeSeriesService = new TimeSeriesService();
        this.userService = new UserService();
        this.walletService = new WalletService();
    }

    public async init() {
        this.scheduleQuaters()
    }

    private scheduleQuaters() {
        cron.schedule('0,15,30,45 * * * *', () => {
            this.collectData();
        });
    }

    private async collectData() {
        const timestamp: number = Date.now();
        const users = await this.userService.find();
        for (const user of users) {
            this.collectUserData(user, timestamp);
        }
    }

    private async collectUserData(user: User, timestamp: number) {
        if (user.linkedExchanges.includes(SupportedExchanges.BITPANDA)) {
            this.collectUserBitpandaData(timestamp);
        }
        if (user.linkedExchanges.includes(SupportedExchanges.BINANCE)) {
            this.collectUserBinanceData(timestamp);
        }
        for (const wallet of await this.walletService.findByUser(user)) {

        }
    }

    private async collectUserWalletData(wallet: CryptoWallet, timestamp: number) {
        //TODO:
    }

    private async collectUserBitpandaData(timestamp: number) {
        //TODO:
    }

    private async collectUserBinanceData(timestamp: number) {

    }
}