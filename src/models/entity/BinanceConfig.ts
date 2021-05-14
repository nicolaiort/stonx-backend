import { Description, Required } from "@tsed/schema";
import { ChildEntity, Column } from "typeorm";
import { SupportedExchanges } from "../enums/SupportedExchanges";
import { ExchangeConfig } from "./ExchangeConfig";

@ChildEntity()
export class BinanceConfig extends ExchangeConfig {
  @Column({ nullable: false })
  @Description("Your binance API key - scope read only! Only provide this if you really want to change it!")
  @Required()
  binance_api_key: string;

  @Column({ nullable: false })
  @Required()
  @Description("Your binance API secret - scope read only! Only provide this if you really want to change it!")
  binance_api_secret: string;

  constructor(exchange: SupportedExchanges, key: string, secret: string) {
    super(exchange);
    this.binance_api_key = key;
    this.binance_api_secret = secret;
  }
}