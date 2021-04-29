import { Required } from "@tsed/schema";
import { SupportedTokens } from "./SupportedTokens";

export class WalletCreation {
    @Required()
    address: string;

    @Required()
    token: string;
}