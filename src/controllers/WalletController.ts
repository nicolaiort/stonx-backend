import { BodyParams, Controller, Delete, Get, PathParams, Post, Req } from "@tsed/common";
import { Authenticate } from "@tsed/passport";
import { Description, Returns, Security } from "@tsed/schema";
import { User } from "../models/entity/User";
import { Wallet } from "../models/Wallet";
import { WalletCreation } from "../models/WalletCreation";
import { WalletService } from "../services/entity/WalletService";
import { GeckoService } from "../services/utils/GeckoService";

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
      returnWallets.push(new Wallet(wallet.token, await wallet.balance(), (await GeckoService.getTokenPrice(wallet.token)), wallet.id, wallet.description));
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
    return new Wallet(wallet.token, await wallet.balance(), (await GeckoService.getTokenPrice(wallet.token)), wallet.id, wallet.description);
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
