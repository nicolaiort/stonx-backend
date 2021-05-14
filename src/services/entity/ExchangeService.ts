import { EntityRepository, Repository } from "typeorm";
import { BinanceConfig } from "../../models/entity/BinanceConfig";
import { BitpandaConfig } from "../../models/entity/BitpandaConfig";
import { ExchangeConfig } from "../../models/entity/ExchangeConfig";
import { User } from "../../models/entity/User";

@EntityRepository(ExchangeConfig)
export class ExchangeService extends Repository<ExchangeConfig> {

  constructor(private bitpandaConfigService: Repository<BitpandaConfig>, private binanceConfigService: Repository<BinanceConfig>) {
    super();
  }

  async findById(id: string): Promise<ExchangeConfig | undefined> {
    return this.findOne({ id: id });
  }

  async findByIdOrFail(id: string): Promise<ExchangeConfig> {
    return this.findOneOrFail({ id: id });
  }

  async findByUser(user: User): Promise<ExchangeConfig[]> {
    return this.find({ owner: user });
  }

  async findBitpandaByUser(user: User): Promise<BitpandaConfig | undefined> {
    return await this.bitpandaConfigService.findOneOrFail({ owner: user });
  }
}