import { getConnectionManager, Repository } from "typeorm";
import { ExchangeConfig } from "../../models/entity/ExchangeConfig";
import { BinanceConfig } from "../../models/entity/exchanges/BinanceConfig";
import { BitpandaConfig } from "../../models/entity/exchanges/BitpandaConfig";
import { User } from "../../models/entity/User";
import { SupportedExchanges } from "../../models/enums/SupportedExchanges";

/**
 * Abstracts the interaction with differnt repositories to provide you functions for working with exchange configs.
 */
export class ExchangeService {

  private bitpandaConfigService: Repository<BitpandaConfig>;
  private binanceConfigService: Repository<BinanceConfig>;
  private configService: Repository<ExchangeConfig>;

  constructor() {
    this.bitpandaConfigService = getConnectionManager().get().getRepository(BitpandaConfig);
    this.binanceConfigService = getConnectionManager().get().getRepository(BinanceConfig);
    this.configService = getConnectionManager().get().getRepository(ExchangeConfig);
  }

  /**
   * Findd all exchanges currently configured by a certain user.
   * @param user The user.
   * @returns An array of SupportedExchanges.
   */
  public async findByUser(user: User): Promise<SupportedExchanges[]> {
    return (await this.configService.find({ owner: user })).map((x) => x.exchange);
  }

  /**
   * Find a user's bitpanda exchange config.
   * @param user The user.
   * @returns The bitpanda exchange config or undefined.
   */
  public async findBitpandaByUser(user: User): Promise<BitpandaConfig | undefined> {
    return this.bitpandaConfigService.findOne({ owner: user });
  }

  /**
   * Find a user's bitpanda exchange config or fail.
   * @param user The user.
   * @returns The bitpanda exchange config.
   */
  public async findBitpandaByUserOrFail(user: User): Promise<BitpandaConfig> {
    return this.bitpandaConfigService.findOneOrFail({ owner: user });
  }

  /**
   * Find a user's binance exchange config.
   * @param user The user.
   * @returns The binance exchange config or undefined.
   */
  public async findBinanceByUser(user: User): Promise<BinanceConfig | undefined> {
    return this.binanceConfigService.findOne({ owner: user });
  }

  /**
   * Find a user's binance exchange config or fail.
   * @param user The user.
   * @returns The binance exchange config.
   */
  public async findBinanceByUserOrFail(user: User): Promise<BinanceConfig> {
    return this.binanceConfigService.findOneOrFail({ owner: user });
  }

  /**
   * Save a new bitpanda exchange config to the db.
   * @param new_config The new bitpanda exchange config.
   * @returns The new BitpandaConfig entity.
   */
  public async createBitpanda(new_config: BitpandaConfig): Promise<BitpandaConfig> {
    return this.bitpandaConfigService.save(new_config);
  }

  /**
   * Save a new binance exchange config to the db.
   * @param new_config The new binance exchange config.
   * @returns The new BinanceConfig entity.
   */
  public async createBinance(new_config: BinanceConfig): Promise<BinanceConfig> {
    return this.binanceConfigService.save(new_config);
  }

  /**
   * Delete an exchange config identified by user and exchange.
   * @param user The user.
   * @param exchange The configs exchange
   * @returns The deleted config or undefined.
   */
  public async delete(user: User, exchange: SupportedExchanges) {
    switch (exchange) {
      case SupportedExchanges.BITPANDA:
        return this.bitpandaConfigService.delete({ owner: user });
      case SupportedExchanges.BINANCE:
        return this.binanceConfigService.delete({ owner: user });
      default:
        throw new Error("Exchange not supported.");
    }
  }
}