import { Description, Email, Optional, Required } from "@tsed/schema";
import { User } from "./entity/User";
import { SupportedExchanges } from "./enums/SupportedExchanges";

export class UserResponse {
  @Optional()
  username: string;

  @Required()
  @Email()
  email: string;

  @Description("The user's jwt. Will get provided on login and signup.")
  token: string;

  @Optional()
  exchanges: SupportedExchanges[];

  constructor(user: User) {
    this.email = user.email
    this.username = user.username;
    this.token = user.token;
    this.exchanges = user.linkedExchanges;
  }
}
