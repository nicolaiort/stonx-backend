import axios from "axios";
import NodeCache from "node-cache";
import { config } from "../../config/env";
import { BitpandaConfig } from "../../models/entity/exchanges/BitpandaConfig";
import { SupportedTokens } from "../../models/enums/SupportedTokens";
import { Wallet } from "../../models/Wallet";

/*
 * This is the cache object that caches api responses for 39 seconds before calling the api again.
 * We do this to mitigate getting banned by the api for making too many requests.
*/
const bitpandaCache = new NodeCache({ stdTTL: 100, checkperiod: 120 });

/**
 * The BitpandaService is a simple api-wrapper over the bitpanda api.
 */
export class BitpandaService {

    /**
     * Returns the current prices of all crypto tokens listed on bitpanda.
     * @returns The pricing data for Bitpanda assets directly from the Bitpanda api.
     */
    public static async getPrices() {
        const cached = bitpandaCache.get(`bitpandaprices`);
        if (cached) {
            return cached;
        }
        const prices = (await axios.get("https://api.bitpanda.com/v1/ticker")).data;
        bitpandaCache.set(`bitpandaprices`, prices, 30);
        return prices;
    }

    /**
     * Returns the current prices of a specific crypto token listed on bitpanda.
     * @param token The name of the token you want the prices of.
     * @returns 
     */
    public static async getTokenPrices(token: SupportedTokens) {
        const cached = bitpandaCache.get(`price-${token}`);
        if (cached) {
            return cached;
        }
        const price = (await this.getPrices())[token.toString()];

        bitpandaCache.set(`price-${token}`, price);
        return price;
    }

    /**
     * Returns your bitpanda crypto token wallets
     * @param user The user who's api key (and therefore account) will be used.
     * @returns Array of Wallet objects wrapped into a promise.
     */
    public static async getWallets(exchange_config: BitpandaConfig): Promise<Wallet[]> {
        const wallets = (
            await axios.get("https://api.bitpanda.com/v1/wallets", {
                headers: {
                    "X-API-KEY": exchange_config.bitpanda_api_key
                }
            })
        ).data.data;
        const prices = await this.getPrices();

        let returnWallets: Wallet[] = new Array<Wallet>();
        for (let wallet of wallets) {
            returnWallets.push(
                new Wallet(
                    wallet.attributes.cryptocoin_symbol,
                    parseFloat(wallet.attributes.balance),
                    parseFloat(prices[wallet.attributes.cryptocoin_symbol][config["CURRENCY"]]),
                    `bitpanda/crypto/${wallet.attributes.balance}`
                )
            );
        }
        return returnWallets;
    }

    /**
     * Returns your bitpanda crypto index wallets
     * @param user The user who's api key (and therefore account) will be used.
     * @returns Array of Wallet objects wrapped into a promise.
     */
    public static async getIndices(exchange_config: BitpandaConfig): Promise<Wallet[]> {
        const indices = (await axios.get("https://api.bitpanda.com/v1/asset-wallets", {
            headers: {
                "X-API-KEY": exchange_config.bitpanda_api_key
            }
        })
        ).data.data.attributes.index.index.attributes.wallets;

        let returnWallets: Wallet[] = new Array<Wallet>();
        for (let index of indices) {
            returnWallets.push(
                new Wallet(index.attributes.cryptocoin_symbol, parseFloat(index.attributes.balance), 1, `bitpanda/index/${index.attributes.cryptocoin_symbol}`)
            );
        }
        return returnWallets;
    }

    /**
     * Validates a bitpanda api key by trying to access the api.
     * @param key The api key that should be validated
     * @returns The validity as a boolean.
     */
    public static async validateApiKey(key: string): Promise<boolean> {
        const res = await axios.get("https://api.bitpanda.com/v1/asset-wallets", {
            headers: {
                "X-API-KEY": key
            },
            validateStatus: null
        });
        if (res.status == 401) {
            return false;
        }
        return true;
    }
}