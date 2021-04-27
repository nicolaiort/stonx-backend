import { BodyParams, Controller, Get, Post, Req } from "@tsed/common";
import { Authenticate, Authorize } from "@tsed/passport";
import { Returns, Security } from "@tsed/schema";
import { Credentials } from "../models/Credentials";
import { User } from "../models/entity/User";
import { UserCreation } from "../models/UserCreation";

@Controller("/auth")
export class PassportCtrl {
  @Post("/login")
  @Authenticate("login", { failWithError: false })
  @Returns(200, User)
  @Returns(400).Description("Validation error")
  login(@Req() req: Req, @BodyParams() credentials: Credentials): User {
    // FACADE
    return (req.user as User);
  }

  @Post("/signup")
  @Returns(201, User)
  @Authenticate("signup")
  signup(@Req() req: Req, @BodyParams() user: UserCreation): User {
    // FACADE
    return (req.user as User);
  }

  @Get("/userinfo")
  @Authenticate("jwt")
  @Returns(200, User)
  getUserInfo(@Req() req: Req): User {
    // FACADE
    return (req.user as User);
  }


  @Get("/logout")
  logout(@Req() req: Req) {
    req.logout();
  }

  @Get("/connect/:protocol")
  @Authorize(":protocol")
  @Returns(200, User)
  connectProtocol(@Req() req: Req): any {
    // FACADE
    return (req.user as User);
  }


  @Get("/connect/:protocol/callback")
  @Authorize(":protocol")
  @Returns(200, User)
  connectProtocolCallback(@Req() req: Req): any {
    // FACADE
    return (req.user as User);
  }
}
