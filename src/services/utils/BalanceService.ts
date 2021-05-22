import axios from "axios";
import { SupportedTokens } from "../../models/enums/SupportedTokens";

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
        switch (token) {
            case SupportedTokens.ETH:
                const resEtherscan = await axios.get(
                    `https://api.blockcypher.com/v1/eth/main/addrs/${address}/balance`
                );
                return parseInt(resEtherscan.data.balance) / 1000000000000000000;
            case SupportedTokens.BTC:
                const resBlockcypher = await axios.get(
                    `https://api.blockcypher.com/v1/btc/main/addrs/${address}/balance`
                );
                return parseInt(resBlockcypher.data.balance) / 100000000;
            case SupportedTokens.DOGE:
                return 0;
                const resDogechain = await axios.get(
                    `https://dogechain.info/api/v1/address/balance/${address}`
                );
                return parseFloat(resDogechain.data.balance);
            case SupportedTokens.IOTA:
                const resIOTA = await axios.get(
                    `https://explorer-api.iota.org/search/mainnet/${address}`
                );
                return parseFloat(resIOTA.data.address.balance) / 1000000000;
            default:
                throw new Error("Token not supported");
        }
    }
}