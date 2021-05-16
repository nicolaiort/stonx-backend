import { Controller, Get, PathParams } from "@tsed/common";
import { Description, Returns } from "@tsed/schema";
import { GeckoService } from "src/services/utils/GeckoService";

@Controller("/prices")
export class PriceController {
  @Get("/:token")
  @Description("Returns the price of the requested token in the preset currency.")
  @Returns(200)
  async getPrice(@PathParams("token") token: string) {
    return (await GeckoService.getSymbolPrice(token)).toString();
  }
}
