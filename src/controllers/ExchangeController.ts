import { BodyParams, Controller, Delete, Get, PathParams, Post, Req } from "@tsed/common";
import { Forbidden } from "@tsed/exceptions";
import { Authenticate } from "@tsed/passport";
import { Description, Returns, Security } from "@tsed/schema";
import { BinanceConfig } from "src/models/entity/BinanceConfig";
import { getConnectionManager } from "typeorm";
import { BitpandaConfig } from "../models/entity/BitpandaConfig";
import { User } from "../models/entity/User";
import { SupportedExchanges } from "../models/enums/SupportedExchanges";
import { ExchangeService } from "../services/entity/ExchangeService";

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

    return exchanges.map((x) => x.exchange as SupportedExchanges);
  }

  @Post("/bitpanda")
  @Authenticate("jwt")
  @Security("jwt")
  @Description("Create a bitpanda connection for yourself.")
  @Returns(200, SupportedExchanges)
  async createBitpandaConfig(@BodyParams() new_config: BitpandaConfig, @Req() req: Req): Promise<SupportedExchanges> {
    const user = (req.user as User);
    const exchange = await getConnectionManager().get().getRepository(BitpandaConfig).findOne({ owner: user });
    if (exchange) {
      throw new Forbidden("You already configured an account for this exchange.");
    }

    new_config.owner = user;
    return (await getConnectionManager().get().getRepository(BitpandaConfig).save(new_config)).exchange as SupportedExchanges;
  }

  @Post("/binance")
  @Authenticate("jwt")
  @Security("jwt")
  @Description("Create a binance connection for yourself.")
  @Returns(200, SupportedExchanges)
  async createBinanceConfig(@BodyParams() new_config: BinanceConfig, @Req() req: Req): Promise<SupportedExchanges> {
    const user = (req.user as User);
    const exchange = await getConnectionManager().get().getRepository(BinanceConfig).findOne({ owner: user });
    if (exchange) {
      throw new Forbidden("You already configured an account for this exchange.");
    }

    new_config.owner = user;
    return (await getConnectionManager().get().getRepository(BinanceConfig).save(new_config)).exchange as SupportedExchanges;
  }

  @Delete("/:exchange")
  @Authenticate("jwt")
  @Security("jwt")
  @Description("Delete one of your wallets.")
  async deleteConfig(@PathParams("exchange") exchange: string, @Req() req: Req): Promise<any> {
    switch (exchange.toUpperCase() as SupportedExchanges) {
      case SupportedExchanges.BITPANDA:
        await getConnectionManager().get().getRepository(BitpandaConfig).delete({ owner: (req.user as User) });
        break;
      case SupportedExchanges.BINANCE:
        await getConnectionManager().get().getRepository(BinanceConfig).delete({ owner: (req.user as User) });
        break;
      default:
        throw new Error("Exchange not supported.");
    }
    return true;
  }

  constructor(private exchangeService: ExchangeService) { }
}