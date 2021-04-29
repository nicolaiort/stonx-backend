import { CryptoWallet } from "src/models/entity/CryptoWallet";
import { UserCreation } from "src/models/UserCreation";
import { WalletCreation } from "src/models/WalletCreation";
import {Repository, EntityRepository} from "typeorm";
import {User} from "../../models/entity/User";

@EntityRepository(CryptoWallet)
export class WalletService extends Repository<CryptoWallet> {
  async findById(id: string): Promise<CryptoWallet | undefined> {
    return this.findOne({ id: id });
  }

  async findByUser(user: User): Promise<CryptoWallet[] | undefined> {
    return this.find({ owner: user });
  }

  async createWallet(owner: User, new_wallet: WalletCreation): Promise<CryptoWallet>{
    let wallet = new CryptoWallet(owner, new_wallet.address, new_wallet.token);
    return this.save(wallet);
  }
}