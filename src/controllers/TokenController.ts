import { BodyParams, Controller, Get, Post, QueryParams, Req } from "@tsed/common";
import { Description, Returns } from "@tsed/schema";
import { SupportedTokens } from "src/models/SupportedTokens";

@Controller("/tokens")
export class TokenController {
    @Get()
    @Description("Returns all currently supported tokens.")
    @Returns(200)
    async getTokens(@Req() req: Req): Promise<string[]> {
        return Object.values(SupportedTokens);
    }
}