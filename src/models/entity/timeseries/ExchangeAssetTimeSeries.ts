import { Enum, Required } from "@tsed/schema";
import { SupportedExchanges } from "src/models/enums/SupportedExchanges";
import { ChildEntity, Column } from "typeorm";
import { User } from "../User";
import { TimeSeriesEntry } from "./TimeSeriesEntry";

@ChildEntity()
export class ExchangeAssetTimeSeries extends TimeSeriesEntry {

  @Column({ nullable: false, type: "text" })
  @Required()
  @Enum(SupportedExchanges)
  exchange: SupportedExchanges;

  @Column({ nullable: false })
  @Required()
  asset_name: string;

  constructor(owner: User, timestamp: Date, balance: number, fiat_value: number, exchange: SupportedExchanges, asset_name: string) {
    super(owner, timestamp, balance, fiat_value);
    this.exchange = exchange;
    this.asset_name = asset_name;
  }
}