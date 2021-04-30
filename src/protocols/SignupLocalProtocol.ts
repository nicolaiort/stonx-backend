import { BodyParams, Constant, Req } from "@tsed/common";
import { Forbidden } from "@tsed/exceptions";
import { OnInstall, OnVerify, Protocol } from "@tsed/passport";
import { Strategy } from "passport-local";
import { config } from "../config/env";
import { User } from "../models/entity/User";
import { UserCreation } from "../models/UserCreation";
import { UserService } from "../services/entity/UserService";

@Protocol({
  name: "signup",
  useStrategy: Strategy,
  settings: {
    usernameField: "email",
    passwordField: "password"
  }
})
export class SignupLocalProtocol implements OnVerify, OnInstall {
  constructor(private userService: UserService) { }

  @Constant("passport.protocols.jwt.settings")
  jwtSettings: any;

  async $onVerify(@Req() request: Req, @BodyParams() user: UserCreation): Promise<User> {
    if (config["ENABLE_SIGNUP"] == "false") {
      throw new Forbidden("Signup is disabled right now. Please try again later or contact the admin.");
    }

    const found_mail = await this.userService.findByEmail(user.email);
    if (found_mail) {
      throw new Forbidden("Email is already registered");
    }

    const found_name = await this.userService.findByEmail(user.username);
    if (found_name) {
      throw new Forbidden("Username is already registered");
    }

    const new_user = await this.userService.createUser(user);

    const token = this.createJwt(new_user);
    new_user.token = token;

    return new_user;
  }

  $onInstall(strategy: Strategy): void {
    // intercept the strategy instance to adding extra configuration
  }

  createJwt(user: User) {
    const { issuer, audience, secretOrKey, maxAge = 3600 } = this.jwtSettings;
    const now = Date.now();

    return jwt.sign(Object.assign({}, new JwtPayload(issuer, audience, user.id, now + maxAge * 1000, now, user.jwt_count)), secretOrKey);
  }
}
