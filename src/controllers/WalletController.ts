import { Controller, Get, QueryParams, Req } from "@tsed/common";
import { Authenticate, Authorize } from "@tsed/passport";
import { Description, Returns } from "@tsed/schema";
import axios from "axios";
import { config } from "src/config/env";
import { User } from "src/models/entity/User";
import { Wallet } from "src/models/Wallet";
import { WalletService } from "src/services/users/WalletService";

@Controller("/wallets")
export class WalletController {
    @Get("/eth")
    @Description("Returns your eth wallets by coin with balance and fiat equivalent.")
    @Returns(200, Wallet)
    @Authenticate("jwt")
    async getEthWallets(@Req() req: Req): Promise<Wallet[]> {
        let wallets = await this.walletService.findByUser((req.user as User));
        if(!wallets){
            return [];
        }

        let prices = (await axios.get('https://api.bitpanda.com/v1/ticker')).data

        let returnWallets: Wallet[] = new Array<Wallet>();

        for (let wallet of wallets) {
                returnWallets.push(new Wallet("ETH", await wallet.balance(), parseFloat(prices["ETH"][config["CURRENCY"]])));
        }

        return returnWallets;
    }

    constructor(private walletService: WalletService) {
    }
}