import { Required } from "@tsed/schema";

export class WalletCreation {
    token: string = "ETH";

    @Required()
    address: string;
}