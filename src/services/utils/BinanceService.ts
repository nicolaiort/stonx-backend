import { NotFound } from "@tsed/exceptions";
import axios from "axios";
import { BinanceTradingPair } from "src/models/BinanceTradingPair";

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
        const res = (await axios.get("https://api.binance.com/api/v3/ticker/price")).data;
        let pairs = new Array<BinanceTradingPair>();
        for (let pair of res) {
            if (pair.symbol == `${token}${currency}`) {
                return new BinanceTradingPair(pair.symbol, pair.price);
            }
        }
        throw new NotFound(`Pair for the token ${token} and the currency/token ${currency} could not be found.`)
    }
}