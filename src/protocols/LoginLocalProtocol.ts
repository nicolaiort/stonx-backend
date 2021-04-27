import { BodyParams, Constant, Req } from "@tsed/common";
import { Unauthorized } from "@tsed/exceptions";
import { OnInstall, OnVerify, Protocol } from "@tsed/passport";
import { IStrategyOptions, Strategy } from "passport-local";
import { User } from "src/models/entity/User";
import { Credentials } from "../models/Credentials";
import { UserService } from "../services/users/UserService";
import * as jwt from "jsonwebtoken";

@Protocol<IStrategyOptions>({
  name: "login",
  useStrategy: Strategy,
  settings: {
    usernameField: "email",
    passwordField: "password"
  }
})
export class LoginLocalProtocol implements OnVerify, OnInstall {

  @Constant("passport.protocols.jwt.settings")
  jwtSettings: any;

  constructor(private userService: UserService) {
  }

  async $onVerify(@Req() request: Req, @BodyParams() credentials: Credentials) {
    const { email, password } = credentials;

    const user = await this.userService.findByEmail(email);

    if (!user) {
      throw new Unauthorized("Unknown user")
    }

    if (!(await user.verifyPassword(password))) {
      throw new Unauthorized("Wrong credentials")
    }

    const token = this.createJwt(user);
    user.token = token;

    return user;
  }

  $onInstall(strategy: Strategy): void {
    // intercept the strategy instance to adding extra configuration
  }

  createJwt(user: User) {
    const { issuer, audience, secretOrKey, maxAge = 3600 } = this.jwtSettings;
    const now = Date.now();

    return jwt.sign(
      {
        iss: issuer,
        aud: audience,
        sub: user.id,
        exp: now + maxAge * 1000,
        iat: now
      },
      secretOrKey
    );
  }
}