import { Controller, Get, PathParams, Req } from "@tsed/common";
import { Authenticate } from "@tsed/passport";
import { Description, Returns, Security } from "@tsed/schema";
import { CryptoWalletTimeSeries } from "src/models/entity/timeseries/CryptoWalletTimeSeries";
import { ExchangeAssetTimeSeries } from "src/models/entity/timeseries/ExchangeAssetTimeSeries";
import { TotalPortfolioTimeSeries } from "src/models/entity/timeseries/TotalPortfolioTimeSeries";
import { User } from "src/models/entity/User";
import { SupportedTokens } from "src/models/enums/SupportedTokens";
import { TimeSeriesRanges } from "src/models/enums/TimeSeriesRanges";
import { TimeSeriesService } from "src/services/entity/TimeSeriesService";

@Controller("/timeseries")
export class TimeSeriesController {
    @Get("/bitpanda/wallets/:token/:range")
    @Authenticate("jwt")
    @Security("jwt")
    @Description("Returns timeseries data for your bitpanda wallet identified by it's token in the desired range.")
    @Returns(200)
    async getBitpandaWalletTimeSeries(@PathParams("token") token: string, @PathParams("range") range: TimeSeriesRanges, @Req() req: Req): Promise<ExchangeAssetTimeSeries[]> {
        return this.timeSeriesService.findBitpandaAssetByUserAndRange((req.user as User), token, range);
    }

    @Get("/bitpanda/indices/:index/:range")
    @Authenticate("jwt")
    @Security("jwt")
    @Description("Returns timeseries data for your bitpanda index identified by it's symbol in the desired range.")
    @Returns(200)
    async getBitpandaIndexTimeSeries(@PathParams("index") index: string, @PathParams("range") range: TimeSeriesRanges, @Req() req: Req): Promise<ExchangeAssetTimeSeries[]> {
        return this.timeSeriesService.findBitpandaAssetByUserAndRange((req.user as User), index, range);
    }

    @Get("/binance/spot/:token/:range")
    @Authenticate("jwt")
    @Security("jwt")
    @Description("Returns timeseries data for your binance spot wallet identified by it's token in the desired range.")
    @Returns(200)
    async getBinanceSpotTimeSeries(@PathParams("token") token: string, @PathParams("range") range: TimeSeriesRanges, @Req() req: Req): Promise<ExchangeAssetTimeSeries[]> {
        return this.timeSeriesService.findBinanceSpotWalletsByUserAndRange((req.user as User), token, range);
    }

    @Get("/wallets/:token/:id/:range")
    @Authenticate("jwt")
    @Security("jwt")
    @Description("Returns timeseries data for one of your custom wallets identified by it's id in the desired range.")
    @Returns(200)
    async getWalletTimeSeries(@PathParams("id") id: string, @PathParams("token") token: SupportedTokens, @PathParams("range") range: TimeSeriesRanges, @Req() req: Req): Promise<CryptoWalletTimeSeries[]> {
        return this.timeSeriesService.findWalletByIdUserTokenAndRange((req.user as User), token, id, range);
    }

    @Get("/portfolio/:range")
    @Authenticate("jwt")
    @Security("jwt")
    @Description("Returns timeseries data for your whole portfolio in the desired range.")
    @Returns(200)
    async getPortfolioTimeSeries(@PathParams("range") range: TimeSeriesRanges, @Req() req: Req): Promise<TotalPortfolioTimeSeries[]> {
        return this.timeSeriesService.findPortfolioByOwner((req.user as User), range);
    }

    constructor(private timeSeriesService: TimeSeriesService) { }
}
