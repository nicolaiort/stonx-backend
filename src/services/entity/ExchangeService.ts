import { getConnectionManager, Repository } from "typeorm";
import { ExchangeConfig } from "../../models/entity/ExchangeConfig";
import { BinanceConfig } from "../../models/entity/exchanges/BinanceConfig";
import { BitpandaConfig } from "../../models/entity/exchanges/BitpandaConfig";
import { User } from "../../models/entity/User";
import { SupportedExchanges } from "../../models/enums/SupportedExchanges";

export class ExchangeService {

  private bitpandaConfigService: Repository<BitpandaConfig>;
  private binanceConfigService: Repository<BinanceConfig>;
  private configService: Repository<ExchangeConfig>;

  constructor() {
    this.bitpandaConfigService = getConnectionManager().get().getRepository(BitpandaConfig);
    this.binanceConfigService = getConnectionManager().get().getRepository(BinanceConfig);
    this.configService = getConnectionManager().get().getRepository(ExchangeConfig);
  }

  public async findByUser(user: User): Promise<SupportedExchanges[]> {
    return (await this.configService.find({ owner: user })).map((x) => x.exchange);
  }

  public async findBitpandaByUser(user: User): Promise<BitpandaConfig | undefined> {
    return this.bitpandaConfigService.findOne({ owner: user });
  }

  public async findBitpandaByUserOrFail(user: User): Promise<BitpandaConfig> {
    return this.bitpandaConfigService.findOneOrFail({ owner: user });
  }

  public async findBinanceByUser(user: User): Promise<BinanceConfig | undefined> {
    return this.binanceConfigService.findOne({ owner: user });
  }
  public async findBinanceByUserOrFail(user: User): Promise<BinanceConfig> {
    return this.binanceConfigService.findOneOrFail({ owner: user });
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