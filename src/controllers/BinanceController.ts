import { Controller, Get, PathParams } from "@tsed/common";
import { Authenticate } from "@tsed/passport";
import { Description, Returns, Security } from "@tsed/schema";
import { BinanceTradingPair } from "src/models/BinanceTradingPair";
import { BinanceService } from "src/services/utils/BinanceService";

@Controller("/binance")
export class BinanceController {
    @Get("/prices")
    @Authenticate("jwt")
    @Security("jwt")
    @Description("Returns the current crypto token prices listen on bitpanda")
    @Returns(200)
    async getTradingPairs(): Promise<BinanceTradingPair[]> {
        return await BinanceService.getTradingPairs();
    }

    @Get("/prices/:token/:currency")
    @Authenticate("jwt")
    @Security("jwt")
    @Description("Returns the current crypto token prices listen on bitpanda")
    @Returns(200)
    async getTradingPair(@PathParams("token") token: string, @PathParams("currency") currency: string): Promise<BinanceTradingPair> {
        return await BinanceService.getTradingPair(token, currency);
    }
}
