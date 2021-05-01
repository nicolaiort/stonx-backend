import { UserUpdating } from "src/models/UserUpdating";
import { EntityRepository, Repository } from "typeorm";
import { User } from "../../models/entity/User";
import { UserCreation } from "../../models/UserCreation";
import { WalletService } from "./WalletService";

@EntityRepository(User)
export class UserService extends Repository<User> {

  constructor(private walletService: WalletService) { super(); }

  async findById(id: string): Promise<User | undefined> {
    return this.findOne({ id: id });
  }

  async findByEmail(email: string): Promise<User | undefined> {
    return this.findOne({ email: email });
  }

  async findByName(username: string): Promise<User | undefined> {
    return this.findOne({ username: username });
  }

  async createUser(new_user: UserCreation): Promise<User> {
    let user = new User(new_user.email, new_user.username);
    user.bitpanda_api_key = new_user.bitpanda_api_key;
    await user.setPassword(new_user.password);
    return this.save(user);
  }

  async increaseJwtCount(user: User) {
    user = await this.findOneOrFail(user);
    user.jwt_count = user.jwt_count + 1;
    await this.save(user);
  }

  async updateById(id: string, update_user: UserUpdating): Promise<User> {
    const user = await this.findOneOrFail({ id: id });
    user.email = update_user.email;
    user.username = update_user.username;

    if (update_user.bitpanda_api_key) {
      user.bitpanda_api_key = update_user.bitpanda_api_key;
    }

    if (update_user.password) {
      user.setPassword(update_user.password);
    }

    return await this.save(user);
  }

  async deleteById(id: string): Promise<User | undefined> {
    const user = await this.findOne({ id: id });
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
