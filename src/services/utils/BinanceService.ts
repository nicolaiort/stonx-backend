import { NotFound } from "@tsed/exceptions";
import axios from "axios";
//@ts-ignore
import Binance from "node-binance-api";
import { config } from "../../config/env";
import { BinanceTradingPair } from "../../models/BinanceTradingPair";
import { Wallet } from "../../models/Wallet";

/**
 * The BinanceService is a simple api-wrapper over the binance api - mainly used to get pricing data.
 */
export class BinanceService {
    public static async getTradingPairs(): Promise<BinanceTradingPair[]> {
        const res = (await axios.get("https://api.binance.com/api/v3/ticker/price")).data;
        let pairs = new Array<BinanceTradingPair>();
        for (let pair of res) {
            pairs.push(new BinanceTradingPair(pair.symbol, pair.price));
        }
        return pairs;
    }

    public static async getTradingPair(token: string, currency: string): Promise<BinanceTradingPair> {
        const pairs = await this.getTradingPairs();
        return this.getPairFromList(token, currency, pairs);
    }

    public static async getSpotWallets(token: string, secret: string) {
        const binance = new Binance().options({
            APIKEY: token,
            APISECRET: secret
        });

        const wallets: any = await new Promise((resolve, reject) => {
            binance.balance((error: Error, balances: any) => {
                if (error) { reject(); }
                resolve(balances);
            });
        });

        const prices = await this.getTradingPairs();
        let returnWallets: Wallet[] = new Array<Wallet>();
        for (let token of wallets.keys) {
            returnWallets.push(
                new Wallet(
                    token,
                    parseFloat(wallets[token].available),
                    this.getPairFromList(token, config["CURRENCY"], prices).price,
                    "bitpanda/crypto"
                )
            );
        }
    }

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
                throw new NotFound(`Pair for the token ${token} and the currency/token ${currency} could not be found.`)
            }
            else {
                //@ts-ignore
                let eurusdt = prices.filter((p) => {
                    return p.symbol == `${currency}USDT`;
                })[0];
                console.log(eurusdt)
                return new BinanceTradingPair(`${token}-USDT-${currency}`, pair.price * eurusdt.price);
            }
        }
    }
}