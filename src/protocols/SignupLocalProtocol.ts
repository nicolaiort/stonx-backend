import {BodyParams, Req} from "@tsed/common";
import {OnInstall, OnVerify, Protocol} from "@tsed/passport";
import {Strategy} from "passport-local";
import {Forbidden} from "@tsed/exceptions";
import {UserCreation} from "../models/UserCreation";
import {UserService} from "../services/users/UserService";
import { User } from "src/models/entity/User";
import { config } from "src/config/env";

@Protocol({
  name: "signup",
  useStrategy: Strategy,
  settings: {
    usernameField: "email",
    passwordField: "password"
  }
})
export class SignupLocalProtocol implements OnVerify, OnInstall {
  constructor(private userService: UserService) {
  }

  async $onVerify(@Req() request: Req, @BodyParams() user: UserCreation): Promise<User> {
    if(config["ENABLE_SIGNUP"] == "false"){
      throw new Forbidden("Signup is disabled right now. Please try again later or contact the admin.")
    }
    const {email} = user;
    const found = await this.userService.findByEmail(email);

    if (found) {
      throw new Forbidden("Email is already registered");
    }

    return this.userService.createUser(user);
  }

  $onInstall(strategy: Strategy): void {
    // intercept the strategy instance to adding extra configuration
  }
}
