import { Description, Ignore, Required } from "@tsed/schema";
import axios from "axios";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { config } from "../../config/env";
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
    switch (this.token) {
      case SupportedTokens.ETH:
        const resEtherscan = await axios.get(
          `https://api.etherscan.io/api?module=account&action=balance&address=${this.address}&tag=latest&apikey=${config["ETHERSCAN_APIKEY"]}`
        );
        return parseInt(resEtherscan.data.result) / 1000000000000000000;
      case SupportedTokens.BTC:
        const resBlockcypher = await axios.get(
          `https://api.blockcypher.com/v1/btc/main/addrs/${this.address}/balance`
        );
        return parseInt(resBlockcypher.data.balance) / 100000000;

      default:
        throw new Error("Token not supported");
    }
  }
}
