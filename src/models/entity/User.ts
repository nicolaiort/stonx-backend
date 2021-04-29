import {Description, Email, Ignore, Optional, Required} from "@tsed/schema";
import {Column, Entity, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import * as argon2 from "argon2";
import {CryptoWallet} from "./CryptoWallet";

@Entity()
export class User {
  @PrimaryGeneratedColumn("uuid")
  @Description("Id assigned by the datbase.")
  @Ignore()
  id: string;

  @Column({unique: true, nullable: true})
  @Optional()
  username: string;

  @Column({unique: true, nullable: false})
  @Required()
  @Email()
  email: string;

  @Column({nullable: false})
  @Ignore()
  password: string;

  @Column()
  @Ignore()
  confirmed: boolean = false;

  @Column({nullable: true})
  @Ignore()
  jwt_count: number = 0;

  @Optional()
  @Description("The user's jwt. Will get provided on login.")
  token: string;

  @Column({nullable: true})
  @Optional()
  @Ignore()
  bitpanda_api_key: string;

  @OneToMany(() => CryptoWallet, (wallet) => wallet.owner, {nullable: true})
  wallets: CryptoWallet[];

  constructor(email: string, username?: string) {
    this.email = email;
    if (username) {
      this.username = username;
    }
    this.confirmed = false;
  }

  async setPassword(new_password: string) {
    this.password = await argon2.hash(new_password);
  }

  async verifyPassword(password: string): Promise<boolean> {
    return await argon2.verify(this.password, password);
  }
}
