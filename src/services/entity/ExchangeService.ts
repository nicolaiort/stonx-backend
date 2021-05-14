import { SupportedExchanges } from "src/models/enums/SupportedExchanges";
import { getConnectionManager, Repository } from "typeorm";
import { BinanceConfig } from "../../models/entity/BinanceConfig";
import { BitpandaConfig } from "../../models/entity/BitpandaConfig";
import { User } from "../../models/entity/User";

export class ExchangeService {

  private bitpandaConfigService: Repository<BitpandaConfig>;
  private binanceConfigService: Repository<BinanceConfig>;

  constructor() {
    this.bitpandaConfigService = getConnectionManager().get().getRepository(BitpandaConfig);
    this.binanceConfigService = getConnectionManager().get().getRepository(BinanceConfig);
  }

  public async findBitpandaByUser(user: User): Promise<BitpandaConfig | undefined> {
    return this.bitpandaConfigService.findOne({ owner: user });
  }

  public async findBinanceByUser(user: User): Promise<BinanceConfig | undefined> {
    return this.binanceConfigService.findOne({ owner: user });
  }

  public async createBitpanda(new_config: BitpandaConfig): Promise<BitpandaConfig> {
    return this.bitpandaConfigService.save(new_config);
  }

  public async createBinance(new_config: BinanceConfig): Promise<BinanceConfig> {
    return this.binanceConfigService.save(new_config);
  }

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