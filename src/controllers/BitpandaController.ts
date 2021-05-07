import { Controller, Get, QueryParams, Req } from "@tsed/common";
import { Authenticate } from "@tsed/passport";
import { Description, Returns, Security } from "@tsed/schema";
import { BitpandaConfig } from "src/models/entity/exchanges/BitpandaConfig";
import { SupportedExchanges } from "src/models/enums/SupportedExchanges";
import { ExchangeService } from "src/services/entity/ExchangeService";
import { User } from "../models/entity/User";
import { Wallet } from "../models/Wallet";
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
        const exchange = (await this.exchangeService.findByUserAndExchange((req.user as User), SupportedExchanges.BITPANDA)) as BitpandaConfig
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
        const exchange = (await this.exchangeService.findByUserAndExchange((req.user as User), SupportedExchanges.BITPANDA)) as BitpandaConfig
        const indices = await BitpandaService.getIndices(exchange);

        let returnWallets: Wallet[] = new Array<Wallet>();

        for (let index of indices) {
            if (!withEmpty && parseFloat(index.attributes.balance) != 0) {
                returnWallets.push(new Wallet(index.attributes.cryptocoin_symbol, parseFloat(index.attributes.balance), 1, "bitpanda/index"));
            } else if (withEmpty) {
                returnWallets.push(new Wallet(index.attributes.cryptocoin_symbol, parseFloat(index.attributes.balance), 1, "bitpanda/index"));
            }
        }

        return returnWallets;
    }

    constructor(private exchangeService: ExchangeService) { }
}
