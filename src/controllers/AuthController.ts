import { BodyParams, Controller, Post, Req } from "@tsed/common";
import { Authenticate, Authorize } from "@tsed/passport";
import { Returns, Security } from "@tsed/schema";
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
  login(@Req() req: Req, @BodyParams() credentials: Credentials): User {
    // FACADE
    return req.user as User;
  }

  @Post("/signup")
  @Returns(201, User)
  @Authenticate("signup")
  signup(@Req() req: Req, @BodyParams() user: UserCreation): User {
    // FACADE
    return req.user as User;
  }

  @Post("/logout")
  @Authorize("jwt")
  @Security("jwt")
  logout(@Req() req: Req) {
    this.userService.increaseJwtCount(req.user as User);
    req.logout();
  }

  constructor(private userService: UserService) { }
}
