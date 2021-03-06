import { Controller, Get, PathParams, QueryParams, Req } from "@tsed/common";
import { Authenticate, Authorize } from "@tsed/passport";
import { Description, Returns, Security } from "@tsed/schema";
import { BinanceTradingPair } from "../models/BinanceTradingPair";
import { User } from "../models/entity/User";
import { Wallet } from "../models/Wallet";
import { ExchangeService } from "../services/entity/ExchangeService";
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
        const exchange = await this.exchangeService.findBinanceByUserOrFail((req.user as User));
        const wallets = await BinanceService.getSpotWallets(exchange);

        if (!withEmpty) {
            return wallets.filter((w) => w.balance > 0)
        }
        return wallets;
    }

    constructor(private exchangeService: ExchangeService) { }
}
