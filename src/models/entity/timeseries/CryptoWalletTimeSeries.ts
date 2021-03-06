import { Required } from "@tsed/schema";
import { Column, Entity } from "typeorm";
import { SupportedTokens } from "../../enums/SupportedTokens";
import { User } from "../User";
import { TimeSeriesEntry } from "./TimeSeriesEntry";

@Entity()
export class CryptoWalletTimeSeries extends TimeSeriesEntry {

  @Column({ nullable: false })
  @Required()
  wallet_id: string;


  @Column({ nullable: false, type: "text" })
  @Required()
  token: SupportedTokens;

  constructor(owner: User, timestamp: number, balance: number, fiat_value: number, id: string, token: SupportedTokens) {
    super(owner, timestamp, balance, fiat_value);
    this.wallet_id = id;
    this.token = token;
  }
}