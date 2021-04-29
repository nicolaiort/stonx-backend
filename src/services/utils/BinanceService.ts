import axios from "axios";
import { BinanceTradingPair } from "src/models/BinanceTradingPair";

/**
 * The BinanceService is a simple api-wrapper over the binance api - mainly used to get pricing data.
 */
export class BinanceService {
    public static async getTradingPairs() {
        const res = (await axios.get("https://api.binance.com/api/v3/ticker/price")).data;
        let pairs = new Array<BinanceTradingPair>();
        for (let pair of res) {
            pairs.push(pair.symbol, pair.price)
        }
        return pairs;
    }
}