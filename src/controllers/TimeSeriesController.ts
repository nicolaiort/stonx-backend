import { Controller, Get, PathParams, Req } from "@tsed/common";
import { Authenticate } from "@tsed/passport";
import { Description, Returns, Security } from "@tsed/schema";
import { ExchangeAssetTimeSeries } from "src/models/entity/timeseries/ExchangeAssetTimeSeries";
import { User } from "src/models/entity/User";
import { TimeSeriesRanges } from "src/models/enums/TimeSeriesRanges";
import { TimeSeriesService } from "src/services/entity/TimeSeriesService";

@Controller("/timeseries")
export class TimeSeriesController {
    @Get("/bitpanda/wallets/:token/:range")
    @Authenticate("jwt")
    @Security("jwt")
    @Description("Returns timeseries data for your bitpanda wallets in the desired range.")
    @Returns(200)
    async getBitpandaWalletTimeSeries(@PathParams("token") token: string, @PathParams("range") range: TimeSeriesRanges, @Req() req: Req): Promise<ExchangeAssetTimeSeries[]> {
        return this.timeSeriesService.findBitpandaAssetByUserAndRange((req.user as User), token, range);
    }

    @Get("/bitpanda/indices/:index/:range")
    @Authenticate("jwt")
    @Security("jwt")
    @Description("Returns timeseries data for your bitpanda indices in the desired range.")
    @Returns(200)
    async getBitpandaIndexTimeSeries(@PathParams("index") index: string, @PathParams("range") range: TimeSeriesRanges, @Req() req: Req): Promise<ExchangeAssetTimeSeries[]> {
        return this.timeSeriesService.findBitpandaAssetByUserAndRange((req.user as User), index, range);
    }

    @Get("/binance/spot/:token/:range")
    @Authenticate("jwt")
    @Security("jwt")
    @Description("Returns timeseries data for your binance spot wallets in the desired range.")
    @Returns(200)
    async getBinanceSpotTimeSeries(@PathParams("token") token: string, @PathParams("range") range: TimeSeriesRanges, @Req() req: Req): Promise<ExchangeAssetTimeSeries[]> {
        return this.timeSeriesService.findBinanceSpotWalletsByUserAndRange((req.user as User), token, range);
    }

    constructor(private timeSeriesService: TimeSeriesService) { }
}
