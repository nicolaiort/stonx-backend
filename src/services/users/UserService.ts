import { UserCreation } from "src/models/UserCreation";
import {Repository, EntityRepository} from "typeorm";
import {User} from "../../models/entity/User";

@EntityRepository(User)
export class UserService extends Repository<User> {
  async findById(id: string): Promise<User | undefined> {
    return this.findOne({ id: id });
  }

  async findByEmail(email: string): Promise<User | undefined> {
    return this.findOne({ email: email });
  }

  async createUser(new_user: UserCreation): Promise<User>{
    let user = new User(new_user.email);
    user.bitpanda_api_key=new_user.bitpanda_api_key;
    await user.setPassword(new_user.password);
    return this.save(user);
  }
}