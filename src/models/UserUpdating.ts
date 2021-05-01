import { Description, Example, Format, Optional, Required } from "@tsed/schema";

export class UserUpdating {
  @Description("User email")
  @Example("user@domain.com")
  @Format("email")
  @Required()
  email: string;

  @Description("username")
  @Required()
  username: string;

  @Description("User password. Only provide this if you really want to change it!")
  @Example("asd123312!")
  @Optional()
  password?: string;

  @Description("Your bitpanda API key - scope Guthaben only!  Only provide this if you really want to change it!")
  @Optional()
  bitpanda_api_key?: string;
}
