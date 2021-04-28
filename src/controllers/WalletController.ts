import { Controller, Get, QueryParams, Req } from "@tsed/common";
import { Authenticate, Authorize } from "@tsed/passport";
import { Description, Returns } from "@tsed/schema";
import axios from "axios";
import { config } from "src/config/env";
import { User } from "src/models/entity/User";
import { Wallet } from "src/models/Wallet";

@Controller("/wallets")
export class BitpandaController {
    @Get("/eth")
    @Description("Returns your bitpanda wallets by coin with balance and fiat equivalent.")
    @Returns(200, Wallet)
    @Authenticate("jwt")
    async getEthWallets(@Req() req: Req): Promise<Wallet[]> {
        let wallets = (await axios.get('https://api.bitpanda.com/v1/wallets', {
            headers: {
                'X-API-KEY': (req.user as User)
            }
        })).data.data;
        let prices = (await axios.get('https://api.bitpanda.com/v1/ticker')).data

        let returnWallets: Wallet[] = new Array<Wallet>();

        for (let wallet of wallets) {
                returnWallets.push(new Wallet(wallet.attributes.cryptocoin_symbol, parseFloat(wallet.attributes.balance), parseFloat(prices[wallet.attributes.cryptocoin_symbol][config["CURRENCY"]])));
        }

        return returnWallets;
    }
}