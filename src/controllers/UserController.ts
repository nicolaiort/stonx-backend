import { Controller, Delete, Get, QueryParams, Req } from "@tsed/common";
import { Forbidden } from "@tsed/exceptions";
import { Authorize } from "@tsed/passport";
import { boolean, Description, Returns, Security } from "@tsed/schema";
import { User } from "../models/entity/User";
import { UserService } from "../services/entity/UserService";

@Controller("/users")
export class UserController {
  @Get("/me")
  @Authorize("jwt")
  @Security("jwt")
  @Returns(200, User)
  @Description("Returns some basic information about you.")
  getUserInfo(@Req() req: Req): User {
    // FACADE
    return req.user as User;
  }

  @Delete("/me")
  @Authorize("jwt")
  @Security("jwt")
  @Returns(200, boolean)
  @Description("Deletes the account an wallets of the user calling this endpoint - handle with caution!")
  async deleteMe(@Req() req: Req, @QueryParams("confirm") confirm: boolean) {
    if (!confirm) {
      throw new Forbidden("You have to confirm the deletion via queryparam.");
    }

    await this.userService.deleteById((req.user as User).id);
    return true;
  }

  constructor(private userService: UserService) { }
}
