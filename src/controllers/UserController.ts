import { BodyParams, Controller, Delete, Get, Put, QueryParams, Req } from "@tsed/common";
import { Forbidden } from "@tsed/exceptions";
import { Authenticate } from "@tsed/passport";
import { boolean, Description, Returns, Security } from "@tsed/schema";
import { User } from "../models/entity/User";
import { UserResponse } from "../models/UserResponse";
import { UserUpdating } from "../models/UserUpdating";
import { UserService } from "../services/entity/UserService";
import { WalletService } from "../services/entity/WalletService";

@Controller("/users")
export class UserController {
  @Get("/me")
  @Authenticate("jwt")
  @Security("jwt")
  @Returns(200, UserResponse)
  @Description("Returns some basic information about you.")
  getUserInfo(@Req() req: Req): UserResponse {
    return new UserResponse(req.user as User);
  }

  @Put("/me")
  @Authenticate("jwt")
  @Security("jwt")
  @Returns(200, UserResponse)
  @Description("Updates the account of the user calling this endpoint.")
  async updateMe(@Req() req: Req, @BodyParams() update_user: UserUpdating): Promise<UserResponse> {
    return new UserResponse(await this.userService.updateByEmail((req.user as User).email, update_user));
  }

  @Delete("/me")
  @Authenticate("jwt")
  @Security("jwt")
  @Returns(200, boolean)
  @Description("Deletes the account and wallets of the user calling this endpoint - handle with caution!")
  async deleteMe(@Req() req: Req, @QueryParams("confirm") confirm: boolean) {
    if (!confirm) {
      throw new Forbidden("You have to confirm the deletion via queryparam.");
    }

    for (let wallet in await this.walletService.findByUser(req.user as User)) {
      await this.walletService.delete(wallet);
    }

    await this.userService.deleteByEmail((req.user as User).email);
    return true;
  }

  constructor(private userService: UserService, private walletService: WalletService) { }
}
