import { Description, Required } from "@tsed/schema";
import { ChildEntity, Column } from "typeorm";
import { SupportedExchanges } from "../../enums/SupportedExchanges";
import { ExchangeConfig } from "../ExchangeConfig";

@ChildEntity()
export class BitpandaConfig extends ExchangeConfig {
  @Column({ nullable: false })
  @Required()
  @Description("Your bitpanda API key - scope Guthaben only!  Only provide this if you really want to change it!")
  bitpanda_api_key: string;

  constructor(exchange: SupportedExchanges, key: string) {
    super(exchange);
    this.bitpanda_api_key = key;
  }
}