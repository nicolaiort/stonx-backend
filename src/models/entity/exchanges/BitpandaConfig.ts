import { Required } from "@tsed/schema";
import { ChildEntity, Column, Entity } from "typeorm";
import { SupportedExchanges } from "../../enums/SupportedExchanges";
import { ExchangeConfig } from "../ExchangeConfig";

@Entity()
@ChildEntity()
export class BitpandaConfig extends ExchangeConfig {
  @Column({ nullable: false })
  @Required()
  bitpanda_api_key: string;

  constructor(exchange: SupportedExchanges, key: string) {
    super(exchange);
    this.bitpanda_api_key = key;
  }
}