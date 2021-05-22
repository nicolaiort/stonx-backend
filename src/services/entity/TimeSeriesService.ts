import { CryptoWalletTimeSeries } from "src/models/entity/timeseries/CryptoWalletTimeSeries";
import { ExchangeAssetTimeSeries } from "src/models/entity/timeseries/ExchangeAssetTimeSeries";
import { getConnectionManager, Repository } from "typeorm";

export class TimeSeriesService {

  private walletTimeSeriesService: Repository<CryptoWalletTimeSeries>;
  private exchangeTimeSeriesService: Repository<ExchangeAssetTimeSeries>;

  constructor() {
    this.walletTimeSeriesService = getConnectionManager().get().getRepository(CryptoWalletTimeSeries);
    this.exchangeTimeSeriesService = getConnectionManager().get().getRepository(ExchangeAssetTimeSeries);
  }

  public async saveExchangeDatapoint(datapoint: ExchangeAssetTimeSeries) {
    return this.exchangeTimeSeriesService.save(datapoint);
  }
}