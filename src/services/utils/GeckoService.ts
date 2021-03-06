import { NotFound } from "@tsed/exceptions";
import axios from "axios";
import NodeCache from 'node-cache';
import { config } from "../../config/env";
import { SupportedTokens } from "../../models/enums/SupportedTokens";

/*
 * This is the cache object that caches coingecko responses for 100 seconds before calling the api again.
 * We do this to mitigate getting banned by the api for making too many requests.
*/
const geckoCache = new NodeCache({ stdTTL: 100, checkperiod: 120 });

/**
 * The GeckoService is a api-wrapper the CoinGecko api.
 * It queries the apis for a token's price in the default currency.
 */
export class GeckoService {
    /**
     * Get the price of any supported token.
     * @param token The token.
     * @returns The token's price in the configured currency.
     */
    public static async getTokenPrice(token: SupportedTokens): Promise<number> {
        switch (token) {
            case SupportedTokens.ETH:
                return this.getPrice("ethereum");
            case SupportedTokens.BTC:
                return this.getPrice("bitcoin");
            case SupportedTokens.IOTA:
                return (await this.getPrice("iota")) * 1000;
            default:
                return this.getSymbolPrice(token.toString())
        }
    }

    /**
     * Get the price of a token by it's symbol
     * @param token_symbol The token's symbol
     * @returns The token's price in the configured currency.
     */
    public static async getSymbolPrice(token_symbol: string): Promise<number> {
        return this.getPrice(await GeckoService.getTokenIdFromSymbol(token_symbol));
    }

    /**
     * Get's a token's coingecko id from it's symbol.
     * @param token_symbol The token's symbol
     * @returns The token's id on coingecko.
     */
    public static async getTokenIdFromSymbol(token_symbol: string): Promise<string> {
        const cached = geckoCache.get(`symbol-${token_symbol}`);
        if (cached) {
            return cached as string;
        }
        const res_id = await axios.get(
            `https://api.coingecko.com/api/v3/coins/list`
        );
        // @ts-ignore
        const token_id = res_id.data.filter((c) => c.symbol.toString() == token_symbol.toLowerCase())[0].id;

        if (!token_id || token_id == '') {
            throw new NotFound("Token not found");
        }
        geckoCache.set(`symbol-${token_symbol}`, token_id, 172800);
        return token_id;
    }

    /**
     * Get a token's price by it's id.
     * @param token_id The token's id.
     * @returns The token's price in the configured currency.
     */
    public static async getPrice(token_id: string): Promise<number> {
        const cached = geckoCache.get(token_id);
        if (cached) {
            return cached as number;
        }
        const res = await axios.get(
            `https://api.coingecko.com/api/v3/simple/price?ids=${token_id}&vs_currencies=${config["CURRENCY"].toString().toLowerCase()}`
        );
        geckoCache.set(token_id, parseFloat(res.data[token_id][config["CURRENCY"].toString().toLowerCase()]));
        return parseFloat(res.data[token_id][config["CURRENCY"].toString().toLowerCase()]);
    }
}