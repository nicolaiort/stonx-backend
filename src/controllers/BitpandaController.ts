import { Controller, Get, QueryParams, Req } from "@tsed/common";
import { Authenticate } from "@tsed/passport";
import { Description, Returns, Security } from "@tsed/schema";
import { config } from "src/config/env";
import { User } from "src/models/entity/User";
import { Wallet } from "src/models/Wallet";
import { BitpandaService } from "src/services/utils/BitpandaService";

@Controller("/bitpanda")
export class BitpandaController {
    @Get("/assets/crypto")
    @Authenticate("jwt")
    @Security("jwt")
    @Description("Returns your bitpanda wallets by coin with balance and fiat equivalent.")
    @Returns(200, Wallet)
    async getCryptoAssets(@QueryParams("withEmpty") withEmpty: boolean = false, @Req() req: Req): Promise<Wallet[]> {
        let wallets = await BitpandaService.getWallets((req.user as User));
        let prices = await BitpandaService.getPrices();
        let returnWallets: Wallet[] = new Array<Wallet>();

        for (let wallet of wallets) {
            if (!withEmpty && parseFloat(wallet.attributes.balance) != 0) {
                returnWallets.push(
                    new Wallet(
                        wallet.attributes.cryptocoin_symbol,
                        parseFloat(wallet.attributes.balance),
                        parseFloat(prices[wallet.attributes.cryptocoin_symbol][config["CURRENCY"]]),
                        "bitpanda/crypto"
                    )
                );
            } else if (withEmpty) {
                returnWallets.push(
                    new Wallet(
                        wallet.attributes.cryptocoin_symbol,
                        parseFloat(wallet.attributes.balance),
                        parseFloat(prices[wallet.attributes.cryptocoin_symbol][config["CURRENCY"]]),
                        "bitpanda/crypto"
                    )
                );
            }
        }

        return returnWallets;
    }

    @Get("/assets/index")
    @Authenticate("jwt")
    @Security("jwt")
    @Description("Returns your bitpanda crypto index wallets with balance.")
    @Returns(200, Wallet)
    async getIndexAssets(@QueryParams("withEmpty") withEmpty: boolean = false, @Req() req: Req): Promise<Wallet[]> {
        let indices = await BitpandaService.getIndices((req.user as User));

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
}
