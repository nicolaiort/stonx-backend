import axios from "axios";
import { SupportedTokens } from "src/models/SupportedTokens";

/**
 * The BalanceService is a api-wrapper over multiple different apis.
 * It queries the apis for a specific address's token balance.
 */
export class BalanceService {
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
                const resDogechain = await axios.get(
                    `https://dogechain.info/api/v1/address/balance/${address}`
                );
                return parseFloat(resDogechain.data.balance);
            default:
                throw new Error("Token not supported");
        }
    }
}