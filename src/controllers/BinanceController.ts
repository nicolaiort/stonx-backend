import { Controller, Get, PathParams } from "@tsed/common";
import { Authorize } from "@tsed/passport";
import { Description, Returns, Security } from "@tsed/schema";
import { Wallet } from "src/models/Wallet";
import { BinanceTradingPair } from "../models/BinanceTradingPair";
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
    @Authorize("jwt")
    @Security("jwt")
    @Description("All of the users spot wallets.")
    @Returns(200)
    async getSpotWallets(): Promise<Wallet[]> {
        //TODO:
        return [];
    }
}
