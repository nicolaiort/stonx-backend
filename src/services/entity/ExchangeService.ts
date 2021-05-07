import { ExchangeConfig } from "src/models/entity/ExchangeConfig";
import { User } from "src/models/entity/User";
import { SupportedExchanges } from "src/models/enums/SupportedExchanges";
import { EntityRepository, Repository } from "typeorm";

@EntityRepository(ExchangeConfig)
export class ExchangeService extends Repository<ExchangeConfig> {

  async findById(id: string): Promise<ExchangeConfig | undefined> {
    return this.findOne({ id: id });
  }

  async findByIdOrFail(id: string): Promise<ExchangeConfig> {
    return this.findOneOrFail({ id: id });
  }

  async findByUser(user: User): Promise<ExchangeConfig[]> {
    return this.find({ owner: user });
  }

  async findByUserAndExchange(user: User, exchange: SupportedExchanges): Promise<ExchangeConfig> {
    return this.findOneOrFail({ owner: user, exchange: exchange });
  }
}
