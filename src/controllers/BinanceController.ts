import { Controller, Get, PathParams, QueryParams, Req } from "@tsed/common";
import { NotFound } from "@tsed/exceptions";
import { Authenticate, Authorize } from "@tsed/passport";
import { Description, Returns, Security } from "@tsed/schema";
import { BinanceConfig } from "src/models/entity/BinanceConfig";
import { User } from "src/models/entity/User";
import { getConnectionManager } from "typeorm";
import { BinanceTradingPair } from "../models/BinanceTradingPair";
import { Wallet } from "../models/Wallet";
import { BinanceService } from "../services/utils/BinanceService";

@Controller("/binance")
export class BinanceController {
    @Get("/prices")
    @Authorize("jwt")
    @Security("jwt")
    @Description("Returns the current crypto token prices listed on binance")
    @Returns(200)
    async getTradingPairs(): Promise<BinanceTradingPair[]> {
        return await BinanceService.getTradingPairs();
    }

    @Get("/prices/:token/:currency")
    @Authorize("jwt")
    @Security("jwt")
    @Description("Returns the price of a specific trading pair listed on binance")
    @Returns(200)
    async getTradingPair(@PathParams("token") token: string, @PathParams("currency") currency: string): Promise<BinanceTradingPair> {
        return await BinanceService.getTradingPair(token, currency);
    }

    @Get("/wallets/spot")
    @Authenticate("jwt")
    @Security("jwt")
    @Description("All of the users spot wallets.")
    @Returns(200)
    async getSpotWallets(@QueryParams("withEmpty") withEmpty: boolean = false, @Req() req: Req): Promise<Wallet[]> {
        const exchange = await getConnectionManager().get().getRepository(BinanceConfig).findOne({ owner: (req.user as User) });
        if (!exchange) {
            throw new NotFound("You haven't configured binance yet.")
        }
        const wallets = await BinanceService.getSpotWallets(exchange.binance_api_key, exchange.binance_api_secret);

        if (!withEmpty) {
            return wallets.filter((w) => w.balance > 0)
        }
        return wallets;
    }
}
