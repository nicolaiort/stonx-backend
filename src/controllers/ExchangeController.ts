import { BodyParams, Controller, Delete, Get, PathParams, Post, Req } from "@tsed/common";
import { Forbidden } from "@tsed/exceptions";
import { Authenticate } from "@tsed/passport";
import { Description, Returns, Security } from "@tsed/schema";
import { BinanceConfig } from "../models/entity/exchanges/BinanceConfig";
import { BitpandaConfig } from "../models/entity/exchanges/BitpandaConfig";
import { User } from "../models/entity/User";
import { SupportedExchanges } from "../models/enums/SupportedExchanges";
import { ExchangeService } from "../services/entity/ExchangeService";

@Controller("/exchanges")
export class ExchangeController {
  @Get()
  @Authenticate("jwt")
  @Security("jwt")
  @Description("Returns your exchanges (Only the type).")
  // @Returns(200, SupportedExchanges)
  async getWallets(@Req() req: Req): Promise<SupportedExchanges[]> {
    return await this.exchangeService.findByUser(req.user as User);
  }

  @Post("/bitpanda")
  @Authenticate("jwt")
  @Security("jwt")
  @Description("Create a bitpanda connection for yourself.")
  // @Returns(200, SupportedExchanges)
  async createBitpandaConfig(@BodyParams() new_config: BitpandaConfig, @Req() req: Req): Promise<SupportedExchanges> {
    const user = (req.user as User);
    const exchange = await await this.exchangeService.findBitpandaByUser(user);
    if (exchange) {
      throw new Forbidden("You already configured an account for this exchange.");
    }

    new_config.owner = user;
    return (await this.exchangeService.createBitpanda(new_config)).exchange as SupportedExchanges;
  }

  @Post("/binance")
  @Authenticate("jwt")
  @Security("jwt")
  @Description("Create a binance connection for yourself.")
  // @Returns(200, SupportedExchanges)
  async createBinanceConfig(@BodyParams() new_config: BinanceConfig, @Req() req: Req): Promise<SupportedExchanges> {
    const user = (req.user as User);
    const exchange = await this.exchangeService.findBinanceByUser(user);
    if (exchange) {
      throw new Forbidden("You already configured an account for this exchange.");
    }

    new_config.owner = user;
    return (await this.exchangeService.createBinance(new_config)).exchange as SupportedExchanges;
  }

  @Delete("/:exchange")
  @Authenticate("jwt")
  @Security("jwt")
  @Description("Delete one of your wallets.")
  async deleteConfig(@PathParams("exchange") exchange: string, @Req() req: Req): Promise<any> {
    this.exchangeService.delete((req.user as User), exchange.toUpperCase() as SupportedExchanges)
    return true;
  }

  constructor(private exchangeService: ExchangeService) { }
}