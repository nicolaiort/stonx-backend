import { EntityRepository, Repository } from "typeorm";
import { User } from "../../models/entity/User";
import { UserCreation } from "../../models/UserCreation";

@EntityRepository(User)
export class UserService extends Repository<User> {
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
}
