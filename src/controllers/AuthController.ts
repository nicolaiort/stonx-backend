import { BodyParams, Controller, Get, Post, Req } from "@tsed/common";
import { Authenticate, Authorize } from "@tsed/passport";
import { Returns, Security } from "@tsed/schema";
import { UserService } from "src/services/users/UserService";
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
  @Authorize("jwt")
  @Returns(200, User)
  getUserInfo(@Req() req: Req): User {
    // FACADE
    return (req.user as User);
  }


  @Post("/logout")
  @Authorize("jwt")
  logout(@Req() req: Req) {
    this.userService.increaseJwtCount((req.user as User));
    req.logout();
  }

  constructor(private userService: UserService) {
  }
}
