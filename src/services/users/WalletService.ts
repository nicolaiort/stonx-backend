import { EthWallet } from "src/models/entity/EthWallet";
import { UserCreation } from "src/models/UserCreation";
import { WalletCreation } from "src/models/WalletCreation";
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

  async createWallet(owner: User, new_wallet: WalletCreation): Promise<EthWallet>{
    let wallet = new EthWallet(owner, new_wallet.address);
    return this.save(wallet);
  }
}