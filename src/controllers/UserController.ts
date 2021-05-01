import { Controller, Delete, Get, Req } from "@tsed/common";
import { Authorize } from "@tsed/passport";
import { Returns, Security } from "@tsed/schema";
import { User } from "../models/entity/User";
import { UserService } from "../services/entity/UserService";

@Controller("/users")
export class UserController {
  @Get()
  @Authorize("jwt")
  @Security("jwt")
  @Returns(200, User)
  getUserInfo(@Req() req: Req): User {
    // FACADE
    return req.user as User;
  }

  @Delete("/delete")
  @Authorize("jwt")
  @Security("jwt")
  async deleteMe(@Req() req: Req) {
    await this.userService.deleteById((req.user as User).id);
    return true;
  }

  constructor(private userService: UserService) { }
}
