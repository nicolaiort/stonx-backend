import { NotFound } from "@tsed/exceptions";
import axios from "axios";
import { config } from "src/config/env";
import { SupportedTokens } from "../../models/enums/SupportedTokens";

/**
 * The GeckoService is a api-wrapper the CoinGecko api.
 * It queries the apis for a token's price in the default currency.
 */
export class GeckoService {
    public static async getTokenPrice(token: SupportedTokens): Promise<number> {
        switch (token) {
            case SupportedTokens.ETH:
                return this.getPrice("ethereum");
            case SupportedTokens.BTC:
                return this.getPrice("bitcoin");
            default:
                return this.getSymbolPrice(token.toString())
        }
    }

    public static async getSymbolPrice(token_symbol: string): Promise<number> {
        return this.getPrice(await GeckoService.getTokenIdFromSymbol(token_symbol));
    }

    public static async getTokenIdFromSymbol(token_symbol: string): Promise<string> {
        const res_id = await axios.get(
            `https://api.coingecko.com/api/v3/coins/list`
        );
        // @ts-ignore
        const token_id = res_id.data.filter((c) => c.symbol.toString() == token_symbol.toLowerCase())[0].id;

        if (!token_id || token_id == '') {
            throw new NotFound("Token not found");
        }
        return token_id;
    }

    public static async getPrice(token_id: string): Promise<number> {
        const res = await axios.get(
            `https://api.coingecko.com/api/v3/simple/price?ids=${token_id}&vs_currencies=${config["CURRENCY"].toString().toLowerCase()}`
        );
        return parseFloat(res.data[token_id][config["CURRENCY"].toString().toLowerCase()]);
    }
}