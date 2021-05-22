import axios from "axios";
//@ts-ignore
import Binance from "node-binance-api";
import { config } from "../../config/env";
import { BinanceTradingPair } from "../../models/BinanceTradingPair";
import { BinanceConfig } from "../../models/entity/exchanges/BinanceConfig";
import { Wallet } from "../../models/Wallet";

/**
 * The BinanceService is a simple api-wrapper over the binance api - mainly used to get pricing data.
 */
export class BinanceService {

    /**
     * Get's all currently supported trading pairs from the Binance api alongside their current price.
     * @returns Array of BinanceTradingPair objects wrapped into a promise.
     */
    public static async getTradingPairs(): Promise<BinanceTradingPair[]> {
        const res = (await axios.get("https://api.binance.com/api/v3/ticker/price")).data;
        let pairs = new Array<BinanceTradingPair>();
        for (let pair of res) {
            pairs.push(new BinanceTradingPair(pair.symbol, pair.price));
        }
        return pairs;
    }

    /**
     * Get's a trading pair straight from the Binance api.
     * @param token The source token of the trading pair.
     * @param currency The target token/currency of the trading pair.
     * @returns BinanceTradingPair object
     */
    public static async getTradingPair(token: string, currency: string): Promise<BinanceTradingPair> {
        const pairs = await this.getTradingPairs();
        return this.getPairFromList(token, currency, pairs);
    }

    /**
     * Get's all of the user's Binance spot wallets and converts them to wallet objects.
     * @param api_config The user's BinanceConfig containing the api key and secret.
     * @returns Array of Wallet objects wrapped into a promise.
     */
    public static async getSpotWallets(api_config: BinanceConfig): Promise<Wallet[]> {
        const binance = new Binance().options({
            APIKEY: api_config.binance_api_key,
            APISECRET: api_config.binance_api_secret,
            useServerTime: true,
            recvWindow: 60000
        });
        await binance.useServerTime();

        const wallets: any = await new Promise((resolve, reject) => {
            binance.balance((error: Error, balances: any) => {
                if (error) { reject(); }
                resolve(balances);
            });
        });

        const prices = await this.getTradingPairs();
        let returnWallets: Wallet[] = new Array<Wallet>();
        for (let token of Object.keys(wallets)) {
            returnWallets.push(
                new Wallet(
                    token,
                    parseFloat(wallets[token].available),
                    this.getPairFromList(token, config["CURRENCY"], prices).price,
                    `binance/crypto/${token}`
                )
            );
        }
        return returnWallets;
    }

    /**
     * Filters a desired trading pair from an array of BinanceTradingPairs with some workaround for non-existing conversions.
     * @param token The source token of the trading pair.
     * @param currency The target token/currency of the trading pair.
     * @param prices The array of BinanceTradingPairs
     * @returns The desired BinanceTradingPair
     */
    private static getPairFromList(token: string, currency: string, prices: Array<any>): BinanceTradingPair {
        let pair = prices.filter((p) => {
            return p.symbol == `${token}${currency}`;
        })[0];
        if (pair) {
            return new BinanceTradingPair(pair.symbol, pair.price);
        }
        else {
            //@ts-ignore
            pair = prices.filter((p) => {
                return p.symbol == `${token}USDT`;
            })[0];
            if (!pair) {
                return new BinanceTradingPair(`N/A`, -1)
            }
            else {
                //@ts-ignore
                let eurusdt = prices.filter((p) => {
                    return p.symbol == `${currency}USDT`;
                })[0];
                return new BinanceTradingPair(`${token}-USDT-${currency}`, pair.price * eurusdt.price);
            }
        }
    }
}