import { Controller, Get, Req } from "@tsed/common";
import { Authenticate } from "@tsed/passport";
import { Description, Returns, Security } from "@tsed/schema";
import { PortfolioService } from "src/services/utils/PortfolioService";
import { User } from "../models/entity/User";
import { Wallet } from "../models/Wallet";

@Controller("/portfolio")
export class PortfolioController {
  @Get("/diversity")
  @Authenticate("jwt")
  @Security("jwt")
  @Description("TODO")
  @Returns(200, Wallet)
  async getDiversity(@Req() req: Req): Promise<Wallet[]> {
    let wallets = await this.portfolioService.getDiversity(req.user as User);
    return wallets;
  }

  constructor(private portfolioService: PortfolioService) { }
}
