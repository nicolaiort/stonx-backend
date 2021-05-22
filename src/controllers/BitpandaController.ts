import { Controller, Get, QueryParams, Req } from "@tsed/common";
import { Authenticate } from "@tsed/passport";
import { Description, Returns, Security } from "@tsed/schema";
import { User } from "../models/entity/User";
import { Wallet } from "../models/Wallet";
import { ExchangeService } from "../services/entity/ExchangeService";
import { BitpandaService } from "../services/utils/BitpandaService";

@Controller("/bitpanda")
export class BitpandaController {

    @Get("/prices")
    @Authenticate("jwt")
    @Security("jwt")
    @Description("Returns the current crypto token prices listen on bitpanda")
    @Returns(200)
    async getPrices() {
        return BitpandaService.getPrices();
    }

    @Get("/assets/crypto")
    @Authenticate("jwt")
    @Security("jwt")
    @Description("Returns your bitpanda wallets by coin with balance and fiat equivalent.")
    @Returns(200, Wallet)
    async getCryptoAssets(@QueryParams("withEmpty") withEmpty: boolean = false, @Req() req: Req): Promise<Wallet[]> {
        const exchange = await this.exchangeService.findBitpandaByUserOrFail((req.user as User));
        const wallets = await BitpandaService.getWallets(exchange);

        if (!withEmpty) {
            return wallets.filter((w) => w.balance != 0)
        }

        return wallets;
    }

    @Get("/assets/index")
    @Authenticate("jwt")
    @Security("jwt")
    @Description("Returns your bitpanda crypto index wallets with balance.")
    @Returns(200, Wallet)
    async getIndexAssets(@QueryParams("withEmpty") withEmpty: boolean = false, @Req() req: Req): Promise<Wallet[]> {
        const exchange = await this.exchangeService.findBitpandaByUserOrFail((req.user as User));
        const indices: Wallet[] = await BitpandaService.getIndices(exchange);

        if (!withEmpty) {
            return indices.filter((w) => w.balance != 0)
        }

        return indices;
    }

    constructor(private exchangeService: ExchangeService) { }
}
