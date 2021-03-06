import { BodyParams, Controller, Post, Req } from "@tsed/common";
import { Authenticate } from "@tsed/passport";
import { Description, Returns, Security } from "@tsed/schema";
import { Credentials } from "../models/Credentials";
import { User } from "../models/entity/User";
import { UserCreation } from "../models/UserCreation";
import { UserResponse } from "../models/UserResponse";
import { UserService } from "../services/entity/UserService";

@Controller("/auth")
export class AuthController {
  @Post("/login")
  @Authenticate("login", { failWithError: false })
  @Security("login")
  @Returns(200, UserResponse)
  @(Returns(400).Description("Validation error"))
  @Description("The path says it all: Logs you in and provides you with a JWT to authenticate against all other endpoints.")
  login(@Req() req: Req, @BodyParams() credentials: Credentials): UserResponse {
    return new UserResponse(req.user as User);
  }

  @Post("/signup")
  @Returns(201, UserResponse)
  @Authenticate("signup")
  @Description("Register for a new account (if signup is endabled)")
  signup(@Req() req: Req, @BodyParams() user: UserCreation): UserResponse {
    return new UserResponse(req.user as User);
  }

  @Post("/logout")
  @Authenticate("jwt")
  @Security("jwt")
  @Description("The path says it all: Logs you out.")
  logout(@Req() req: Req) {
    this.userService.increaseJwtCount(req.user as User);
    req.logout();
  }

  constructor(private userService: UserService) { }
}
