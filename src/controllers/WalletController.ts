import { BodyParams, Controller, Get, Post, QueryParams, Req } from "@tsed/common";
import { Authenticate, Authorize } from "@tsed/passport";
import { Description, Returns } from "@tsed/schema";
import axios from "axios";
import { config } from "src/config/env";
import { User } from "src/models/entity/User";
import { Wallet } from "src/models/Wallet";
import { WalletCreation } from "src/models/WalletCreation";
import { WalletService } from "src/services/users/WalletService";

@Controller("/wallets")
export class WalletController {
    @Get()
    @Description("Returns your wallets by coin with balance and fiat equivalent.")
    @Returns(200, Wallet)
    @Authenticate("jwt")
    async getEthWallets(@Req() req: Req): Promise<Wallet[]> {
        let wallets = await this.walletService.findByUser((req.user as User));
        if (!wallets) {
            return [];
        }

        let prices = (await axios.get('https://api.bitpanda.com/v1/ticker')).data

        let returnWallets: Wallet[] = new Array<Wallet>();

        for (let wallet of wallets) {
            returnWallets.push(new Wallet("ETH", await wallet.balance(), parseFloat(prices[wallet.token][config["CURRENCY"]])));
        }

        return returnWallets;
    }

    @Post()
    @Description("Create a new wallet for yourself.")
    @Returns(200, Wallet)
    @Authenticate("jwt")
    async createEthWallets(@BodyParams() new_wallet: WalletCreation, @Req() req: Req): Promise<Wallet> {
        let wallet = await this.walletService.createWallet((req.user as User), new_wallet);
        let prices = (await axios.get('https://api.bitpanda.com/v1/ticker')).data
        return new Wallet("ETH", await wallet.balance(), parseFloat(prices[wallet.token][config["CURRENCY"]]));
    }

    constructor(private walletService: WalletService) {
    }
}