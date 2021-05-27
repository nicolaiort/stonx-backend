import NodeCache from "node-cache";
import { User } from "src/models/entity/User";
import { Wallet } from "src/models/Wallet";
import { getConnectionManager } from "typeorm";
import { ExchangeService } from "../entity/ExchangeService";
import { WalletService } from "../entity/WalletService";
import { BinanceService } from "./BinanceService";
import { BitpandaService } from "./BitpandaService";
import { GeckoService } from "./GeckoService";

/*
 * This is the cache object that caches api responses for 39 seconds before calling the api again.
 * We do this to mitigate getting banned by the api for making too many requests.
*/
const portfolioCache = new NodeCache({ stdTTL: 100, checkperiod: 120 });

export class PortfolioService {

    private walletService: WalletService;
    private exchangeService: ExchangeService;

    constructor() {
        this.walletService = getConnectionManager().get().getCustomRepository(WalletService);
        this.exchangeService = new ExchangeService();
    }

    public async getDiversity(user: User): Promise<Wallet[]> {
        const cached = portfolioCache.get(`${user.id}-diversity`);
        if (cached) {
            return cached as Wallet[];
        }

        const promises = new Array<Promise<any>>();
        let wallets: Wallet[] = new Array<Wallet>();
        const bitpanda_config = await this.exchangeService.findBitpandaByUser(user);
        const binance_config = await this.exchangeService.findBinanceByUser(user);
        if (bitpanda_config) {
            promises.push(BitpandaService.getWallets(bitpanda_config).then((res) => {
                wallets.push(...res);
            }));
            promises.push(BitpandaService.getIndices(bitpanda_config).then((res) => {
                wallets.push(...res);
            }));
        }
        if (binance_config) {
            promises.push(BinanceService.getSpotWallets(binance_config).then((res) => {
                wallets.push(...res);
            }));
        }
        promises.push(this.walletService.findByUser(user).then(async (res) => {
            for (let wallet of res) {
                wallets.push(new Wallet(wallet.token, await wallet.balance(), (await GeckoService.getTokenPrice(wallet.token)), wallet.id, wallet.description));
            }
        }));
        await Promise.all(promises);
        wallets = wallets.filter((w) => w.balance != 0);
        const asset_tokens = new Array<string>();
        const assets = new Array<Wallet>();

        for (let wallet of wallets) {
            if (!(asset_tokens.includes(wallet.token))) {
                asset_tokens.push(wallet.token);
                assets.push(new Wallet(wallet.token, wallets.filter((w) => w.token == wallet.token).reduce((sum, cur) => sum = sum + cur.fiat, 0), 1, wallet.token));
            }
        }

        portfolioCache.set(`${user.id}-diversity`, assets);
        return assets;
    }
}