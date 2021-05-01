import { BodyParams, Controller, Post, Req } from "@tsed/common";
import { Authenticate, Authorize } from "@tsed/passport";
import { Description, Returns, Security } from "@tsed/schema";
import { Credentials } from "../models/Credentials";
import { User } from "../models/entity/User";
import { UserCreation } from "../models/UserCreation";
import { UserService } from "../services/entity/UserService";

@Controller("/auth")
export class AuthController {
  @Post("/login")
  @Authenticate("login", { failWithError: false })
  @Security("local")
  @Returns(200, User)
  @(Returns(400).Description("Validation error"))
  @Description("The path says it all: Logs you in and provides you with a JWT to authenticate against all other endpoints.")
  login(@Req() req: Req, @BodyParams() credentials: Credentials): User {
    return req.user as User;
  }

  @Post("/signup")
  @Returns(201, User)
  @Authenticate("signup")
  @Description("Register for a new account (if signup is endabled)")
  signup(@Req() req: Req, @BodyParams() user: UserCreation): User {
    return req.user as User;
  }

  @Post("/logout")
  @Authorize("jwt")
  @Security("jwt")
  @Description("The path says it all: Logs you out.")
  logout(@Req() req: Req) {
    this.userService.increaseJwtCount(req.user as User);
    req.logout();
  }

  constructor(private userService: UserService) { }
}
