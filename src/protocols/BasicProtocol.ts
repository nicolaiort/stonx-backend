import {Req} from "@tsed/common";
import {Arg, OnInstall, OnVerify, Protocol} from "@tsed/passport";
import {Strategy} from "passport";
import {BasicStrategy} from "passport-http";
import {UserService} from "../services/users/UserService";

@Protocol({
  name: "basic",
  useStrategy: BasicStrategy,
  settings: {}
})
export class BasicProtocol implements OnVerify, OnInstall {
  constructor(private userService: UserService) {
  }

  async $onVerify(@Req() request: Req, @Arg(0) username: string, @Arg(1) password: string) {
    //TODO: Mail verification 

    const user = await this.userService.findByEmail(username);

    if (!user) {
      return false;
    }

    if (!(await user.verifyPassword(password))) {
      return false;
    }

    return user;
  }

  $onInstall(strategy: Strategy): void {
    // intercept the strategy instance to adding extra configuration
  }
}
