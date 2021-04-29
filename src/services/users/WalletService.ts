import { EntityRepository, Repository } from "typeorm";
import { CryptoWallet } from "../../models/entity/CryptoWallet";
import { User } from "../../models/entity/User";
import { SupportedTokens } from "../../models/SupportedTokens";
import { WalletCreation } from "../../models/WalletCreation";

@EntityRepository(CryptoWallet)
export class WalletService extends Repository<CryptoWallet> {
  async findById(id: string): Promise<CryptoWallet> {
    return this.findOneOrFail({ id: id });
  }

  async findByUser(user: User): Promise<CryptoWallet[]> {
    return this.find({ owner: user });
  }

  async createWallet(owner: User, new_wallet: WalletCreation): Promise<CryptoWallet> {
    let wallet = new CryptoWallet(owner, new_wallet.address, new_wallet.token as SupportedTokens);
    return this.save(wallet);
  }
}
