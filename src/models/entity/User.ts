import { Description, Email, Ignore, Optional, Required } from "@tsed/schema";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import * as argon2 from "argon2";

@Entity()
export class User {
  @PrimaryGeneratedColumn("uuid")
  @Description("Id assigned by the datbase.")
  @Ignore()
  id: string;

  @Column({ unique: true, nullable: true })
  @Optional()
  username: string;

  @Column({ unique: true, nullable: false })
  @Required()
  @Email()
  email: string;

  @Column({ nullable: false })
  @Ignore()
  password: string;

  @Column()
  @Ignore()
  confirmed: boolean = false;

  @Column({ nullable: true })
  @Ignore()
  jwt_count: number = 0;

  @Optional()
  @Description("The user's jwt. Will get provided on login.")
  token: string;

  @Column({ nullable: true })
  @Optional()
  @Ignore()
  bitpanda_api_key: string;

  constructor(email: string) {
    this.email = email;
    this.confirmed = false;
  }

  async setPassword(new_password: string) {
    this.password = await argon2.hash(new_password);
  }

  async verifyPassword(password: string): Promise<boolean> {
    return await argon2.verify(this.password, password)
  }
}