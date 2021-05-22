import { Controller, Get, PathParams, Req } from "@tsed/common";
import { Authenticate } from "@tsed/passport";
import { Description, Returns, Security } from "@tsed/schema";
import { ExchangeAssetTimeSeries } from "src/models/entity/timeseries/ExchangeAssetTimeSeries";
import { TimeSeriesService } from "src/services/entity/TimeSeriesService";

@Controller("/timeseries")
export class TimeSeriesController {
    @Get("/bitpanda/wallets/:token")
    @Authenticate("jwt")
    @Security("jwt")
    @Description("TODO:")
    @Returns(200)
    async getTradingPair(@PathParams("token") token: string, @Req() req: Req): Promise<ExchangeAssetTimeSeries[]> {
        return [];
    }

    constructor(private timeSeriesService: TimeSeriesService) { }
}
