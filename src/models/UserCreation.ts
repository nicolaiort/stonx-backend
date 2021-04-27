import {Required, Description} from "@tsed/schema";
import {Credentials} from "./Credentials";

export class UserCreation extends Credentials {
  @Description("username")
  username: string;

  @Description("Your bitpanda API key")
  bitpanda_api_key: string;
}
