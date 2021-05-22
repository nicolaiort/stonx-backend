import { EntityRepository, Repository } from "typeorm";
import { CryptoWallet } from "../../models/entity/CryptoWallet";
import { User } from "../../models/entity/User";
import { SupportedTokens } from "../../models/enums/SupportedTokens";
import { WalletCreation } from "../../models/WalletCreation";

/**
 * Provides standardized functions for interacting with the (custom) wallet entities in the db.
 */
@EntityRepository(CryptoWallet)
export class WalletService extends Repository<CryptoWallet> {

  /**
   * Find a wallet by it's id or fail.
   * @param id The id of the wallet you want to receive.
   * @returns The wallet entity wrapped into a Promise.
   */
  async findById(id: string): Promise<CryptoWallet> {
    return this.findOneOrFail({ id: id });
  }

  /**
   * Find all wallets associated with a user.
   * @param user The user.
   * @returns An array of wallet entites wrapped into a Promise.
   */
  async findByUser(user: User): Promise<CryptoWallet[]> {
    return this.find({ owner: user });
  }

  /**
   * Convert a WalletCreation into a new wallet entity and save it to the db.
   * @param owner The new wallet's owner (user).
   * @param new_wallet The new wallet.
   * @returns The new wallet entity wrapped into a Promise.
   */
  async createWallet(owner: User, new_wallet: WalletCreation): Promise<CryptoWallet> {
    let wallet = new CryptoWallet(owner, new_wallet.address, new_wallet.token as SupportedTokens, new_wallet.description);
    return this.save(wallet);
  }
}
