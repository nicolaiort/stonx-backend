import { Controller, Get, Req } from "@tsed/common";
import { Authenticate } from "@tsed/passport";
import { Description, Returns, Security } from "@tsed/schema";
import { User } from "../models/entity/User";
import { Wallet } from "../models/Wallet";
import { PortfolioService } from "../services/utils/PortfolioService";

@Controller("/portfolio")
export class PortfolioController {
  @Get("/diversity")
  @Authenticate("jwt")
  @Security("jwt")
  @Description("Returns all of your assets values summed up by token/index")
  @Returns(200, Wallet)
  async getDiversity(@Req() req: Req): Promise<Wallet[]> {
    let wallets = await this.portfolioService.getDiversity(req.user as User);
    return wallets;
  }

  constructor(private portfolioService: PortfolioService) { }
}
