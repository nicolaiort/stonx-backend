import { Description, Ignore, Required } from "@tsed/schema";
import { Column, PrimaryGeneratedColumn } from "typeorm";
import { User } from "../User";

export abstract class TimeSeriesEntry {
  @PrimaryGeneratedColumn("uuid")
  @Description("Id assigned by the datbase.")
  @Ignore()
  id: string;

  @Column({ nullable: false })
  @Required()
  owner_id: string;

  @Column({ nullable: false, type: 'bigint' })
  @Required()
  timestamp: number;

  @Column({ nullable: true, type: 'float' })
  @Required()
  balance: number;

  @Column({ nullable: true, type: 'float' })
  @Required()
  fiat_value: number;

  constructor(owner: User, timestamp: number, balance: number, fiat_value: number) {
    this.owner_id = owner?.id || "-1";
    this.timestamp = timestamp;
    this.balance = balance;
    this.fiat_value = fiat_value;
  }
}