import axios from "axios";
import NodeCache from "node-cache";
import { config } from "../../config/env";
import { SupportedTokens } from "../../models/enums/SupportedTokens";

/*
 * This is the cache object that caches api responses for 39 seconds before calling the api again.
 * We do this to mitigate getting banned by the api for making too many requests.
*/
const balanceCache = new NodeCache({ stdTTL: 30, checkperiod: 40 });

/**
 * The BalanceService is a api-wrapper over multiple different apis.
 * It queries the apis for a specific address's token balance.
 */
export class BalanceService {
    /**
     * Get the balance for a wallet identified by it's token and address.
     * @param address The wallet's address.
     * @param token The wallet's token.
     * @returns The balance in the token's main decimal denominator.
     */
    public static async getBalance(address: string, token: SupportedTokens): Promise<number> {
        const cached = balanceCache.get(`${token}-tokenaddress-${address}`);
        if (cached) {
            return cached as number;
        }
        switch (token) {
            case SupportedTokens.ETH:
                const resEtherscan = await axios.get(
                    `https://api.etherscan.io/api?module=account&action=balance&address=${address}&tag=latest&apikey=${config["ETHERSCAN_APIKEY"]}`
                );
                balanceCache.set(`${token}-tokenaddress-${address}`, (parseInt(resEtherscan.data.balance) / 1000000000000000000));
                return parseInt(resEtherscan.data.result) / 1000000000000000000;
            case SupportedTokens.BTC:
                const resBlockcypher = await axios.get(
                    `https://api.blockcypher.com/v1/btc/main/addrs/${address}/balance`
                );
                balanceCache.set(`${token}-tokenaddress-${address}`, (parseInt(resBlockcypher.data.balance) / 100000000));
                return parseInt(resBlockcypher.data.balance) / 100000000;
            case SupportedTokens.DOGE:
                const resDogechain = await axios.get(
                    `https://dogechain.info/api/v1/address/balance/${address}`
                );
                balanceCache.set(`${token}-tokenaddress-${address}`, parseFloat(resDogechain.data.balance));
                return parseFloat(resDogechain.data.balance);
            case SupportedTokens.IOTA:
                const resIOTA = await axios.get(
                    `https://explorer-api.iota.org/search/mainnet/${address}`
                );
                balanceCache.set(`${token}-tokenaddress-${address}`, parseFloat(resIOTA.data.address.balance) / 1000000000);
                return parseFloat(resIOTA.data.address.balance) / 1000000000;
            default:
                throw new Error("Token not supported");
        }
    }
}