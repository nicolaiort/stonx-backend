import { BodyParams, Controller, Delete, Get, Put, QueryParams, Req } from "@tsed/common";
import { Forbidden } from "@tsed/exceptions";
import { Authorize } from "@tsed/passport";
import { boolean, Description, Returns, Security } from "@tsed/schema";
import { UserUpdating } from "src/models/UserUpdating";
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
    return req.user as User;
  }

  @Put("/me")
  @Authorize("jwt")
  @Security("jwt")
  @Returns(200, boolean)
  @Description("Updates the account of the user calling this endpoint.")
  async updateMe(@Req() req: Req, @BodyParams() update_user: UserUpdating): Promise<User> {
    return this.userService.updateByEmail((req.user as User).email, update_user);
  }

  @Delete("/me")
  @Authorize("jwt")
  @Security("jwt")
  @Returns(200, boolean)
  @Description("Deletes the account and wallets of the user calling this endpoint - handle with caution!")
  async deleteMe(@Req() req: Req, @QueryParams("confirm") confirm: boolean) {
    if (!confirm) {
      throw new Forbidden("You have to confirm the deletion via queryparam.");
    }

    await this.userService.deleteByEmail((req.user as User).email);
    return true;
  }

  constructor(private userService: UserService) { }
}
