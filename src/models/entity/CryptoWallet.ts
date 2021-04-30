import { Description, Ignore, Required } from "@tsed/schema";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { BalanceService } from "../../services/utils/BalanceService";
import { SupportedTokens } from "../SupportedTokens";
import { User } from "./User";

@Entity()
export class CryptoWallet {
  @PrimaryGeneratedColumn("uuid")
  @Description("Id assigned by the datbase.")
  @Ignore()
  id: string;

  @ManyToOne(() => User, (user) => user.wallets)
  owner: User;

  @Column({ nullable: false, type: "text" })
  @Required()
  token: SupportedTokens;

  @Column({ nullable: false })
  address: string;

  @Column({ nullable: true })
  description?: string;

  constructor(owner: User, address: string, token: SupportedTokens, description?: string) {
    this.address = address;
    this.owner = owner;
    this.token = token;
    if (description) {
      this.description = description;
    }
  }

  async balance(): Promise<number> {
    return BalanceService.getBalance(this.address, this.token)
  }
}