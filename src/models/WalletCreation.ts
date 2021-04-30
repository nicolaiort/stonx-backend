import { Optional, Required } from "@tsed/schema";

export class WalletCreation {
  @Required()
  address: string;

  @Required()
  token: string;

  @Optional()
  description?: string;
}
