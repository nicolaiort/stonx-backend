import { Required } from "@tsed/schema";
import { ChildEntity, Column } from "typeorm";
import { User } from "../User";
import { TimeSeriesEntry } from "./TimeSeriesEntry";

@ChildEntity()
export class CryptoWalletTimeSeries extends TimeSeriesEntry {

  @Column({ nullable: false })
  @Required()
  wallet_id: string;

  @Column({ nullable: false })
  @Required()
  wallet_address: string;

  constructor(id: string, address: string, owner: User, timestamp: Date, balance: number, fiat_value: number) {
    super(owner, timestamp, balance, fiat_value);
    this.wallet_id = id;
    this.wallet_address = address;
  }
}