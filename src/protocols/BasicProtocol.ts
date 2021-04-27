import {Req} from "@tsed/common";
import { Unauthorized } from "@tsed/exceptions";
import {Arg, OnInstall, OnVerify, Protocol} from "@tsed/passport";
import {Strategy} from "passport";
import {BasicStrategy} from "passport-http";
import { User } from "src/models/entity/User";
import {UserService} from "../services/users/UserService";

@Protocol({
  name: "basic",
  useStrategy: BasicStrategy,
  settings: {}
})
export class BasicProtocol implements OnVerify, OnInstall {
  constructor(private userService: UserService) {
  }

  async $onVerify(@Req() request: Req, @Arg(0) username: string, @Arg(1) password: string): Promise<User> {
    const user = await this.userService.findByEmail(username);

    if (!user) {
      throw new Unauthorized("Unknown user")
    }

    if (!(await user.verifyPassword(password))) {
      throw new Unauthorized("Wrong credentials")
    }

    return user;
  }

  $onInstall(strategy: Strategy): void {
    // intercept the strategy instance to adding extra configuration
  }
}
