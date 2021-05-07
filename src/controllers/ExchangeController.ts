import { BodyParams, Controller, Get, Post, Req } from "@tsed/common";
import { Forbidden } from "@tsed/exceptions";
import { Authenticate } from "@tsed/passport";
import { Description, Returns, Security } from "@tsed/schema";
import { ExchangeConfig } from "src/models/entity/ExchangeConfig";
import { SupportedExchanges } from "src/models/enums/SupportedExchanges";
import { ExchangeService } from "src/services/entity/ExchangeService";
import { User } from "../models/entity/User";

@Controller("/exchanges")
export class ExchangeController {
  @Get()
  @Authenticate("jwt")
  @Security("jwt")
  @Description("Returns your exchanges (Only the type).")
  @Returns(200, SupportedExchanges)
  async getWallets(@Req() req: Req): Promise<SupportedExchanges[]> {
    const exchanges = await this.exchangeService.findByUser(req.user as User);
    if (!exchanges) {
      return [];
    }

    return exchanges.map((x) => x.exchange);
  }

  @Post()
  @Authenticate("jwt")
  @Security("jwt")
  @Description("Create a new wallet for yourself.")
  @Returns(200, SupportedExchanges)
  async createWallets(@BodyParams() new_config: ExchangeConfig, @Req() req: Req): Promise<SupportedExchanges> {
    const exchange = this.exchangeService.findByUserAndExchange((req.user as User), new_config.exchange);
    if (exchange) {
      throw new Forbidden("You already configured an account for this exchange.");
    }

    return (await this.exchangeService.createExchange(new_config)).exchange;
  }

  // @Delete("/:id")
  // @Authenticate("jwt")
  // @Security("jwt")
  // @Description("Delete one of your wallets.")
  // @Returns(200, Wallet)
  // async deleteWallet(@PathParams("id") id: string, @Req() req: Req): Promise<any> {
  //   await this.walletService.delete({ id: id });
  //   return true;
  // }

  constructor(private exchangeService: ExchangeService) { }
}
