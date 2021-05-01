import { BadRequest, Forbidden, NotFound } from "@tsed/exceptions";
import { EntityRepository, Repository } from "typeorm";
import { User } from "../../models/entity/User";
import { UserCreation } from "../../models/UserCreation";
import { UserUpdating } from "../../models/UserUpdating";
import { BitpandaService } from "../utils/BitpandaService";
import { WalletService } from "./WalletService";

@EntityRepository(User)
export class UserService extends Repository<User> {

  constructor(private walletService: WalletService) { super(); }

  async findById(id: string): Promise<User | undefined> {
    return this.findOne({ id: id });
  }
  async findByIdOrFail(id: string): Promise<User> {
    return this.findOneOrFail({ id: id });
  }

  async findByEmail(email: string): Promise<User | undefined> {
    return this.findOne({ email: email });
  }

  async findByName(username: string): Promise<User | undefined> {
    return this.findOne({ username: username });
  }

  async createUser(new_user: UserCreation): Promise<User> {
    let user = new User(new_user.email, new_user.username);
    const key_valid: boolean = await BitpandaService.validateApiKey(new_user.bitpanda_api_key);
    if (!key_valid) {
      throw new BadRequest("Bitpanda API Key is invalid.")
    }
    user.bitpanda_api_key = new_user.bitpanda_api_key;
    await user.setPassword(new_user.password);
    return this.save(user);
  }

  async increaseJwtCount(user: User) {
    user = await this.findOneOrFail(user);
    user.jwt_count = user.jwt_count + 1;
    await this.save(user);
  }

  async updateByEmail(email: string, update_user: UserUpdating): Promise<User> {
    const user = await this.findByEmail(email);
    if (!user) {
      throw new NotFound("User not found");
    }

    const user_email = await this.findByEmail(update_user.email);
    const user_name = await this.findByName(update_user.username);

    if (user_email && user_email?.id != user.id) {
      throw new Forbidden("Email is already registered");
    }
    if (user_name && user_name?.id != user.id) {
      throw new Forbidden("Username is already registered");
    }

    user.email = update_user.email;
    user.username = update_user.username;

    if (update_user.bitpanda_api_key) {
      const key_valid: boolean = await BitpandaService.validateApiKey(update_user.bitpanda_api_key);
      if (!key_valid) {
        throw new BadRequest("Bitpanda API Key is invalid.")
      }
      user.bitpanda_api_key = update_user.bitpanda_api_key;
    }

    if (update_user.password) {
      await user.setPassword(update_user.password);
    }

    await this.save(user);
    return this.findByIdOrFail(user.id);
  }

  async deleteByEmail(email: string): Promise<User | undefined> {
    const user = await this.findByEmail(email);
    if (!user) {
      return undefined;
    }

    for (let wallet of (await this.walletService.findByUser(user))) {
      await this.walletService.delete(wallet);
    }

    await this.delete(user);
    return user;
  }
}
