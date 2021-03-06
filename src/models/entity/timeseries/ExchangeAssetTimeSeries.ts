import { Enum, Required } from "@tsed/schema";
import { Column, Entity } from "typeorm";
import { SupportedExchanges } from "../../enums/SupportedExchanges";
import { User } from "../User";
import { TimeSeriesEntry } from "./TimeSeriesEntry";

@Entity()
export class ExchangeAssetTimeSeries extends TimeSeriesEntry {

  @Column({ nullable: false, type: "text" })
  @Required()
  @Enum(SupportedExchanges)
  exchange: SupportedExchanges;

  @Column({ nullable: false })
  @Required()
  asset_name: string;

  constructor(owner: User, timestamp: number, balance: number, fiat_value: number, exchange: SupportedExchanges, asset_name: string) {
    super(owner, timestamp, balance, fiat_value);
    this.exchange = exchange;
    this.asset_name = asset_name;
  }
}