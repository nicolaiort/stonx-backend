import { Controller, Get, PathParams } from "@tsed/common";
import { Authorize } from "@tsed/passport";
import { Description, Returns, Security } from "@tsed/schema";
import { BinanceTradingPair } from "../models/BinanceTradingPair";
import { BinanceService } from "../services/utils/BinanceService";

@Controller("/binance")
export class BinanceController {
    @Get("/prices")
    @Authorize("jwt")
    @Security("jwt")
    @Description("Returns the current crypto token prices listen on bitpanda")
    @Returns(200)
    async getTradingPairs(): Promise<BinanceTradingPair[]> {
        return await BinanceService.getTradingPairs();
    }

    @Get("/prices/:token/:currency")
    @Authorize("jwt")
    @Security("jwt")
    @Description("Returns the current crypto token prices listen on bitpanda")
    @Returns(200)
    async getTradingPair(@PathParams("token") token: string, @PathParams("currency") currency: string): Promise<BinanceTradingPair> {
        return await BinanceService.getTradingPair(token, currency);
    }
}
