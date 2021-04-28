import { Description, Email, Ignore, Optional, Required } from "@tsed/schema";
import axios from "axios";
import { config } from "src/config/env";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./User";

@Entity()
export class EthWallet {
  @PrimaryGeneratedColumn("uuid")
  @Description("Id assigned by the datbase.")
  @Ignore()
  id: string;

  @ManyToOne(() => User, user => user.wallets)
  owner: User;

  @Column({ nullable: false })
  @Required()
  token: string = "ETH";

  @Column({ nullable: false })
  address: string;

  async balance():Promise<number>{
    const res = await axios.get(`https://api.etherscan.io/api?module=account&action=balance&address=${this.address}&tag=latest&apikey=${config["ETHERSCAN_APIKEY"]}`)
    return (parseInt(res.data.result)*0.1);
  }

  constructor(owner: User, address: string) {
    this.address = address;
    this.owner = owner;
  }
}