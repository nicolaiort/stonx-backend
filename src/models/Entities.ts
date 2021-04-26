import { Email } from "@tsed/schema";
import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity()
export class User {

  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({unique: true})
  username: string;

  @Column({unique: true})
  @Email()
  email: string;

  @Column()
  confirmed: boolean;

  @Column()
  bitpanda_api_key: string;
}