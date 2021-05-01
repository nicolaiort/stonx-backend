import { Description, Example, Format, Optional, Required } from "@tsed/schema";

export class UserUpdating {
  @Description("User password. Only provide this if you really want to change it")
  @Example("asd123312!")
  @Optional()
  password: string;

  @Description("User email")
  @Example("user@domain.com")
  @Format("email")
  @Required()
  email: string;

  @Description("username")
  @Required()
  username: string;

  @Description("Your bitpanda API key - scope Guthaben only!")
  @Required()
  bitpanda_api_key: string;
}
