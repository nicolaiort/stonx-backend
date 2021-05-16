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
        let token_id = "";

        switch (token) {
            case SupportedTokens.ETH:
                token_id = "ethereum";
                break;
            case SupportedTokens.BTC:
                token_id = "bitcoin";
                break;
            default:
                const res_id = await axios.get(
                    `https://api.coingecko.com/api/v3/coins/list`
                );
                // @ts-ignore
                token_id = res_id.data.filter((c) => c.symbol.toString() == token.toString().toLowerCase())[0].id;

                if (!token_id || token_id == '') {
                    throw new NotFound("Token not found");
                }
        }

        const res = await axios.get(
            `https://api.coingecko.com/api/v3/simple/price?ids=${token_id}&vs_currencies=${config["CURRENCY"].toString().toLowerCase()}`
        );
        return parseInt(res.data[token_id][config["CURRENCY"]]);
    }
}