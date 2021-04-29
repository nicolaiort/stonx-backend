import { BodyParams, Controller, Get, Post, QueryParams, Req } from "@tsed/common";
import { Authenticate, Authorize } from "@tsed/passport";
import { Description, Returns } from "@tsed/schema";
import axios from "axios";
import { config } from "src/config/env";
import { User } from "src/models/entity/User";
import { SupportedTokens } from "src/models/SupportedTokens";
import { Wallet } from "src/models/Wallet";
import { WalletCreation } from "src/models/WalletCreation";
import { WalletService } from "src/services/users/WalletService";

@Controller("/tokens")
export class TokenController {
    @Get()
    @Description("Returns all currently supported tokens.")
    @Returns(200)
    async getTokens(@Req() req: Req): Promise<string[]> {
        return Object.values(SupportedTokens);
    }
}