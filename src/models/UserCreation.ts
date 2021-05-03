import { Description, Optional, Required } from "@tsed/schema";
import { Credentials } from "./Credentials";

export class UserCreation extends Credentials {
  @Description("username")
  @Required()
  username: string;

  @Description("Your bitpanda API key - scope Guthaben only!")
  @Optional()
  bitpanda_api_key: string;
}
