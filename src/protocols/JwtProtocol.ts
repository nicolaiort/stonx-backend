import { Req } from "@tsed/common";
import { Unauthorized } from "@tsed/exceptions";
import { Arg, OnVerify, Protocol } from "@tsed/passport";
import { Description, Required } from "@tsed/schema";
import { ExtractJwt, Strategy, StrategyOptions } from "passport-jwt";
import { config } from "../config/env";
import { User } from "../models/entity/User";
import { UserService } from "../services/entity/UserService";

export class JwtPayload {
  @Required()
  @Description("The JWT's issuer")
  iss: string;

  @Required()
  @Description("The JWT's audience")
  aud: string;

  @Required()
  @Description("The JWT's subject (user id)")
  sub: string;

  @Required()
  @Description("The JWT's expiry date in unix/epoch time")
  exp: number;

  @Required()
  @Description("The JWT's issuance date in unix/epoch time")
  iat: number;

  @Required()
  @Description("The users current jwt count")
  cnt: number;

  constructor(iss: string, aud: string, sub: string, exp: number, iat: number, cnt: number) {
    this.iss = iss;
    this.aud = aud;
    this.sub = sub;
    this.exp = exp;
    this.iat = iat;
    this.cnt = cnt;
  }
}

@Protocol<StrategyOptions>({
  name: "jwt",
  useStrategy: Strategy,
  settings: {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: config["JWT_SECRET"],
    issuer: "accounts.examplesoft.com",
    audience: "yoursite.net"
  }
})
export class JwtProtocol implements OnVerify {
  constructor(private userService: UserService) { }

  async $onVerify(@Req() req: Req, @Arg(0) jwtPayload: JwtPayload): Promise<User> {
    if (jwtPayload.exp < Date.now()) {
      throw new Unauthorized("Expired jwt");
    }

    const user = await this.userService.findById(jwtPayload.sub);

    if (!user) {
      throw new Unauthorized("Wrong jwt");
    }

    if (user.jwt_count > jwtPayload.cnt) {
      throw new Unauthorized("Jwt no longer valid");
    }

    return user;
  }
}
