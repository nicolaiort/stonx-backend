import {Description, Email, Ignore, Optional, Required} from "@tsed/schema";
import axios from "axios";
import {config} from "src/config/env";
import {Column, Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {SupportedTokens} from "../SupportedTokens";
import {User} from "./User";

@Entity()
export class CryptoWallet {
  @PrimaryGeneratedColumn("uuid")
  @Description("Id assigned by the datbase.")
  @Ignore()
  id: string;

  @ManyToOne(() => User, (user) => user.wallets)
  owner: User;

  @Column({nullable: false, type: "text"})
  @Required()
  token: SupportedTokens;

  @Column({nullable: false})
  address: string;

  constructor(owner: User, address: string, token: SupportedTokens) {
    this.address = address;
    this.owner = owner;
    this.token = token;
  }

  async balance(): Promise<number> {
    switch (this.token) {
      case SupportedTokens.ETH:
        const res = await axios.get(
          `https://api.etherscan.io/api?module=account&action=balance&address=${this.address}&tag=latest&apikey=${config["ETHERSCAN_APIKEY"]}`
        );
        return parseInt(res.data.result) / 1000000000000000000;
      default:
        throw new Error("Token not supported");
    }
  }
}
