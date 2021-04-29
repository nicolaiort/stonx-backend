import { BodyParams, Controller, Delete, Get, PathParams, Post, Req } from "@tsed/common";
import { Authenticate } from "@tsed/passport";
import { Description, Returns, Security } from "@tsed/schema";
import { config } from "src/config/env";
import { User } from "src/models/entity/User";
import { Wallet } from "src/models/Wallet";
import { WalletCreation } from "src/models/WalletCreation";
import { WalletService } from "src/services/users/WalletService";
import { BinanceService } from "src/services/utils/BinanceService";

@Controller("/wallets")
export class WalletController {
  @Get()
  @Authenticate("jwt")
  @Security("jwt")
  @Description("Returns your wallets by coin with balance and fiat equivalent.")
  @Returns(200, Wallet)
  async getWallets(@Req() req: Req): Promise<Wallet[]> {
    let wallets = await this.walletService.findByUser(req.user as User);
    if (!wallets) {
      return [];
    }

    let returnWallets: Wallet[] = new Array<Wallet>();

    for (let wallet of wallets) {
      returnWallets.push(new Wallet("ETH", await wallet.balance(), (await BinanceService.getTradingPair(wallet.token, config["CURRENCY"])).price, wallet.id));
    }

    return returnWallets;
  }

  @Post()
  @Authenticate("jwt")
  @Security("jwt")
  @Description("Create a new wallet for yourself.")
  @Returns(200, Wallet)
  async createWallets(@BodyParams() new_wallet: WalletCreation, @Req() req: Req): Promise<Wallet> {
    let wallet = await this.walletService.createWallet(req.user as User, new_wallet);
    return new Wallet("ETH", await wallet.balance(), (await BinanceService.getTradingPair(wallet.token, config["CURRENCY"])).price, wallet.id);
  }

  @Delete("/:id")
  @Authenticate("jwt")
  @Security("jwt")
  @Description("Delete one of your wallets.")
  @Returns(200, Wallet)
  async deleteWallet(@PathParams("id") id: string, @Req() req: Req): Promise<any> {
    await this.walletService.delete({ id: id });
    return true;
  }

  constructor(private walletService: WalletService) { }
}
