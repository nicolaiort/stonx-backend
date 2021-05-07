import { Required } from "@tsed/schema";
import { ChildEntity, Column, Entity } from "typeorm";
import { SupportedExchanges } from "../../enums/SupportedExchanges";
import { ExchangeConfig } from "../ExchangeConfig";

@Entity()
@ChildEntity()
export class BinanceConfig extends ExchangeConfig {
  @Column({ nullable: false })
  @Required()
  binance_api_key: string;

  @Column({ nullable: false })
  @Required()
  binance_api_secret: string;

  constructor(exchange: SupportedExchanges, key: string, secret: string) {
    super(exchange);
    this.binance_api_key = key;
    this.binance_api_secret = secret;
  }
}