import { Required } from "@tsed/schema";
import { SupportedTokens } from "src/models/enums/SupportedTokens";
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

  @Column({ nullable: false, type: "text" })
  @Required()
  token: SupportedTokens;

  constructor(owner: User, timestamp: number, balance: number, fiat_value: number, id: string, address: string, token: SupportedTokens) {
    super(owner, timestamp, balance, fiat_value);
    this.wallet_id = id;
    this.wallet_address = address;
    this.token = token;
  }
}