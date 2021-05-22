import { Description, Ignore, Required } from "@tsed/schema";
import { Column, Entity, PrimaryGeneratedColumn, TableInheritance } from "typeorm";
import { User } from "./User";

@Entity()
@TableInheritance({ column: { name: "type", type: "varchar" } })
export abstract class TimeSeriesEntry {
  @PrimaryGeneratedColumn("uuid")
  @Description("Id assigned by the datbase.")
  @Ignore()
  id: string;

  @Column({ nullable: false })
  @Required()
  owner_id: string;

  @Column({ nullable: false })
  @Required()
  timestamp: Date;

  @Column({ nullable: false })
  @Required()
  balance: number;

  @Column({ nullable: false })
  @Required()
  fiat_value: number;

  constructor(owner: User, timestamp: Date, balance: number, fiat_value: number) {
    this.owner_id = owner.id;
    this.timestamp = timestamp;
    this.balance = balance;
    this.fiat_value = fiat_value;
  }
}