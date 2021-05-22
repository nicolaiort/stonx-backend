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
    @Description("TODO:")
    @Returns(200)
    async getBitpandaWalletTimeSeries(@PathParams("token") token: string, @PathParams("range") range: TimeSeriesRanges, @Req() req: Req): Promise<ExchangeAssetTimeSeries[]> {
        return this.timeSeriesService.findBitpandaWalletByUserAndRange((req.user as User), token, range);
    }

    constructor(private timeSeriesService: TimeSeriesService) { }
}
