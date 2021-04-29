import { Description } from "@tsed/schema";
import axios from "axios";
import { User } from "src/models/entity/User";
import { SupportedTokens } from "src/models/SupportedTokens";

@Description("The BitpandaService is a simple api-wrapper over the bitpanda api.")
export class BitpandaService {

    @Description("Returns the current prices of all crypto tokens listed on bitpanda")
    public static async getPrices() {
        return (await axios.get("https://api.bitpanda.com/v1/ticker")).data;
    }

    @Description("Returns the current prices of a specific crypto token listed on bitpanda")
    public static async getTokenPrices(token: SupportedTokens) {
        return (await this.getPrices())[token.toString()];
    }

    @Description("Returns your bitpanda crypto wallets")
    public static async getWallets(user: User) {
        return (
            await axios.get("https://api.bitpanda.com/v1/wallets", {
                headers: {
                    "X-API-KEY": user.bitpanda_api_key
                }
            })
        ).data.data;
    }

    @Description("Returns your bitpanda crypto index wallets")
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