import { Description, Enum, Ignore, Required } from "@tsed/schema";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, TableInheritance } from "typeorm";
import { SupportedExchanges } from "../enums/SupportedExchanges";
import { User } from "./User";

@Entity()
@TableInheritance({ column: { name: "type", type: "varchar" } })
export abstract class ExchangeConfig {
  @PrimaryGeneratedColumn("uuid")
  @Description("Id assigned by the datbase.")
  @Ignore()
  id: string;

  @ManyToOne(() => User, (user) => user.wallets)
  owner: User;

  @Column({ nullable: false, type: "text" })
  @Required()
  @Enum(SupportedExchanges)
  exchange: SupportedExchanges;

  constructor(exchange: SupportedExchanges | string) {
    this.exchange = exchange as SupportedExchanges;
  }
}