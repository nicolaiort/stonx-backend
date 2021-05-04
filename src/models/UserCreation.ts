import { Description, Required } from "@tsed/schema";
import { Credentials } from "./Credentials";

export class UserCreation extends Credentials {
  @Description("username")
  @Required()
  username: string;
}
