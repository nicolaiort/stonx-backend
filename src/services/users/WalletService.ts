import { EthWallet } from "src/models/entity/EthWallet";
import { UserCreation } from "src/models/UserCreation";
import {Repository, EntityRepository} from "typeorm";
import {User} from "../../models/entity/User";

@EntityRepository(EthWallet)
export class WalletService extends Repository<EthWallet> {
  async findById(id: string): Promise<EthWallet | undefined> {
    return this.findOne({ id: id });
  }

  async findByUser(user: User): Promise<EthWallet[] | undefined> {
    return this.find({ owner: user });
  }

  async createWallet(new_user: UserCreation): Promise<EthWallet>{
    let user = new User(new_user.email);
    user.bitpanda_api_key=new_user.bitpanda_api_key;
    await user.setPassword(new_user.password);
    return this.save(user);
  }
}