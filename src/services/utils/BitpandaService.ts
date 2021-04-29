import axios from "axios";
import { User } from "src/models/entity/User";
import { SupportedTokens } from "src/models/SupportedTokens";

/**
 * The BitpandaService is a simple api-wrapper over the bitpanda api.
 */
export class BitpandaService {

    /**
     * Returns the current prices of all crypto tokens listed on bitpanda.
     * @returns 
     */
    public static async getPrices() {
        return (await axios.get("https://api.bitpanda.com/v1/ticker")).data;
    }

    /**
     * Returns the current prices of a specific crypto token listed on bitpanda.
     * @param token The name of the token you want the prices of.
     * @returns 
     */
    public static async getTokenPrices(token: SupportedTokens) {
        return (await this.getPrices())[token.toString()];
    }

    /**
     * Returns your bitpanda crypto token wallets
     * @param user The user who's api key (and therefore account) will be used.
     * @returns 
     */
    public static async getWallets(user: User) {
        return (
            await axios.get("https://api.bitpanda.com/v1/wallets", {
                headers: {
                    "X-API-KEY": user.bitpanda_api_key
                }
            })
        ).data.data;
    }

    /**
     * Returns your bitpanda crypto index wallets
     * @param user The user who's api key (and therefore account) will be used.
     * @returns 
     */
    public static async getIndices(user: User) {
        return (
            await axios.get("https://api.bitpanda.com/v1/asset-wallets", {
                headers: {
                    "X-API-KEY": user.bitpanda_api_key
                }
            })
        ).data.data.attributes.index.index.attributes.wallets;
    }
}