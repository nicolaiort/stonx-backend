import { Controller, Get, QueryParams, Req } from "@tsed/common";
import { Authenticate, Authorize } from "@tsed/passport";
import { Description, Returns } from "@tsed/schema";
import axios from "axios";
import { config } from "src/config/env";
import { User } from "src/models/entity/User";
import { Wallet } from "src/models/Wallet";

@Controller("/bitpanda")
export class BitpandaController {
    @Get("/assets/crypto")
    @Description("Returns your bitpanda wallets by coin with balance and fiat equivalent.")
    @Returns(200, Wallet)
    @Authenticate("jwt")
    async getCryptoAssets(@QueryParams("withEmpty") withEmpty: boolean = false, @Req() req: Req): Promise<Wallet[]> {
        let wallets = (await axios.get('https://api.bitpanda.com/v1/wallets', {
            headers: {
                'X-API-KEY': (req.user as User).bitpanda_api_key
            }
        })).data.data;
        let prices = (await axios.get('https://api.bitpanda.com/v1/ticker')).data

        let returnWallets: Wallet[] = new Array<Wallet>();

        for (let wallet of wallets) {
            if (!withEmpty && parseFloat(wallet.attributes.balance) != 0) {
                returnWallets.push(new Wallet(wallet.attributes.cryptocoin_symbol, parseFloat(wallet.attributes.balance), parseFloat(prices[wallet.attributes.cryptocoin_symbol][config["CURRENCY"]]), "bitpanda/crypto"));
            }
            else if (withEmpty) {
                returnWallets.push(new Wallet(wallet.attributes.cryptocoin_symbol, parseFloat(wallet.attributes.balance), parseFloat(prices[wallet.attributes.cryptocoin_symbol][config["CURRENCY"]]), "bitpanda/crypto"));
            }
        }

        return returnWallets;
    }

    @Get("/assets/index")
    @Description("Returns your bitpanda crypto index wallets with balance.")
    @Returns(200, Wallet)
    @Authenticate("jwt")
    async getIndexAssets(@QueryParams("withEmpty") withEmpty: boolean = false, @Req() req: Req): Promise<Wallet[]> {
        let indices = (await axios.get('https://api.bitpanda.com/v1/asset-wallets', {
            headers: {
                'X-API-KEY': (req.user as User).bitpanda_api_key
            }
        })).data.data.attributes.index.index.attributes.wallets;

        let returnWallets: Wallet[] = new Array<Wallet>();

        for (let index of indices) {
            if (!withEmpty && parseFloat(index.attributes.balance) != 0) {
                returnWallets.push(new Wallet(index.attributes.cryptocoin_symbol, parseFloat(index.attributes.balance), 1, "bitpanda/index"));
            }
            else if (withEmpty) {
                returnWallets.push(new Wallet(index.attributes.cryptocoin_symbol, parseFloat(index.attributes.balance), 1, "bitpanda/index"))
            }
        }

        return returnWallets;
    }
}