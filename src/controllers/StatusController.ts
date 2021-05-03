import { Controller, Get, Req } from "@tsed/common";
import { Description, Returns } from "@tsed/schema";
import { SupportedExchanges } from "../models/enums/SupportedExchanges";
import { SupportedTokens } from "../models/enums/SupportedTokens";

@Controller("/status")
export class StatusController {
  @Get("/tokens")
  @Description("Returns all currently supported tokens.")
  @Returns(200)
  async getTokens(@Req() req: Req): Promise<string[]> {
    return Object.values(SupportedTokens);
  }

  @Get("/exchanges")
  @Description("Returns all currently supported exchanges.")
  @Returns(200)
  async getExchanges(@Req() req: Req): Promise<string[]> {
    return Object.values(SupportedExchanges);
  }
}
