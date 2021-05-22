import { CryptoWalletTimeSeries } from "src/models/entity/timeseries/CryptoWalletTimeSeries";
import { ExchangeAssetTimeSeries } from "src/models/entity/timeseries/ExchangeAssetTimeSeries";
import { User } from "src/models/entity/User";
import { SupportedExchanges } from "src/models/enums/SupportedExchanges";
import { SupportedTokens } from "src/models/enums/SupportedTokens";
import { TimeSeriesRanges } from "src/models/enums/TimeSeriesRanges";
import { getConnectionManager, MoreThan, Repository } from "typeorm";

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

  public async saveWalletDatapoint(datapoint: CryptoWalletTimeSeries) {
    return this.walletTimeSeriesService.save(datapoint);
  }

  public async findBitpandaAssetByUserAndRange(owner: User, asset: string, range: TimeSeriesRanges): Promise<ExchangeAssetTimeSeries[]> {
    const now = new Date();
    switch (range) {
      case TimeSeriesRanges.ALL:
        const all = await this.exchangeTimeSeriesService.find({ owner_id: owner.id, asset_name: asset, exchange: SupportedExchanges.BITPANDA });
        return all.filter((d) => {
          let date = new Date(d.timestamp);
          return date.getHours() == 0 && date.getMinutes() == 0;
        });
      case TimeSeriesRanges.THISYEAR:
        now.setFullYear(now.getFullYear() - 1);
        const allInYear = await this.exchangeTimeSeriesService.find({ owner_id: owner.id, asset_name: asset, exchange: SupportedExchanges.BITPANDA, timestamp: MoreThan(now.getTime()) })
        return allInYear.filter((d) => {
          let date = new Date(d.timestamp);
          return date.getHours() == 0 && date.getMinutes() == 0;
        });
      case TimeSeriesRanges.THISMONTH:
        now.setMonth(now.getMonth() - 1);
        const allInMonth = await this.exchangeTimeSeriesService.find({ owner_id: owner.id, asset_name: asset, exchange: SupportedExchanges.BITPANDA, timestamp: MoreThan(now.getTime()) })
        return allInMonth.filter((d) => {
          let date = new Date(d.timestamp);
          return date.getHours() == 0 && date.getMinutes() == 0;
        });
      case TimeSeriesRanges.THISWEEK:
        now.setMonth(now.setDate(now.getDate() - 7));
        const allInWeek = await this.exchangeTimeSeriesService.find({ owner_id: owner.id, asset_name: asset, exchange: SupportedExchanges.BITPANDA, timestamp: MoreThan(now.getTime()) })
        return allInWeek.filter((d) => {
          let date = new Date(d.timestamp);
          return date.getHours() == 0 && date.getMinutes() == 0;
        });
      case TimeSeriesRanges.TODAY:
        return this.exchangeTimeSeriesService.find({ owner_id: owner.id, asset_name: asset, exchange: SupportedExchanges.BITPANDA, timestamp: MoreThan(now.getTime() - 24 * 60 * 60 * 1000) });
      default:
        throw new Error("Not supported yet.");
    }
  }

  public async findBinanceSpotWalletsByUserAndRange(owner: User, asset: string, range: TimeSeriesRanges): Promise<ExchangeAssetTimeSeries[]> {
    const now = new Date();
    switch (range) {
      case TimeSeriesRanges.ALL:
        const all = await this.exchangeTimeSeriesService.find({ owner_id: owner.id, asset_name: asset, exchange: SupportedExchanges.BINANCE });
        return all.filter((d) => {
          let date = new Date(d.timestamp);
          return date.getHours() == 0 && date.getMinutes() == 0;
        });
      case TimeSeriesRanges.THISYEAR:
        now.setFullYear(now.getFullYear() - 1);
        const allInYear = await this.exchangeTimeSeriesService.find({ owner_id: owner.id, asset_name: asset, exchange: SupportedExchanges.BINANCE, timestamp: MoreThan(now.getTime()) })
        return allInYear.filter((d) => {
          let date = new Date(d.timestamp);
          return date.getHours() == 0 && date.getMinutes() == 0;
        });
      case TimeSeriesRanges.THISMONTH:
        now.setMonth(now.getMonth() - 1);
        const allInMonth = await this.exchangeTimeSeriesService.find({ owner_id: owner.id, asset_name: asset, exchange: SupportedExchanges.BINANCE, timestamp: MoreThan(now.getTime()) })
        return allInMonth.filter((d) => {
          let date = new Date(d.timestamp);
          return date.getHours() == 0 && date.getMinutes() == 0;
        });
      case TimeSeriesRanges.THISWEEK:
        now.setMonth(now.setDate(now.getDate() - 7));
        const allInWeek = await this.exchangeTimeSeriesService.find({ owner_id: owner.id, asset_name: asset, exchange: SupportedExchanges.BINANCE, timestamp: MoreThan(now.getTime()) })
        return allInWeek.filter((d) => {
          let date = new Date(d.timestamp);
          return date.getHours() == 0 && date.getMinutes() == 0;
        });
      case TimeSeriesRanges.TODAY:
        return this.exchangeTimeSeriesService.find({ owner_id: owner.id, asset_name: asset, exchange: SupportedExchanges.BINANCE, timestamp: MoreThan(now.getTime() - 24 * 60 * 60 * 1000) });
      default:
        throw new Error("Not supported yet.");
    }
  }

  public async findWalletByIdUserTokenAndRange(owner: User, token: SupportedTokens, id: string, range: TimeSeriesRanges): Promise<CryptoWalletTimeSeries[]> {
    const now = new Date();
    switch (range) {
      case TimeSeriesRanges.ALL:
        const all = await this.walletTimeSeriesService.find({ owner_id: owner.id, token: token, wallet_id: id });
        return all.filter((d) => {
          let date = new Date(d.timestamp);
          return date.getHours() == 0 && date.getMinutes() == 0;
        });
      case TimeSeriesRanges.THISYEAR:
        now.setFullYear(now.getFullYear() - 1);
        const allInYear = await this.walletTimeSeriesService.find({ owner_id: owner.id, token: token, wallet_id: id, timestamp: MoreThan(now.getTime()) })
        return allInYear.filter((d) => {
          let date = new Date(d.timestamp);
          return date.getHours() == 0 && date.getMinutes() == 0;
        });
      case TimeSeriesRanges.THISMONTH:
        now.setMonth(now.getMonth() - 1);
        const allInMonth = await this.walletTimeSeriesService.find({ owner_id: owner.id, token: token, wallet_id: id, timestamp: MoreThan(now.getTime()) })
        return allInMonth.filter((d) => {
          let date = new Date(d.timestamp);
          return date.getHours() == 0 && date.getMinutes() == 0;
        });
      case TimeSeriesRanges.THISWEEK:
        now.setMonth(now.setDate(now.getDate() - 7));
        const allInWeek = await this.walletTimeSeriesService.find({ owner_id: owner.id, token: token, wallet_id: id, timestamp: MoreThan(now.getTime()) })
        return allInWeek.filter((d) => {
          let date = new Date(d.timestamp);
          return date.getHours() == 0 && date.getMinutes() == 0;
        });
      case TimeSeriesRanges.TODAY:
        return this.walletTimeSeriesService.find({ owner_id: owner.id, token: token, wallet_id: id, timestamp: MoreThan(now.getTime() - 24 * 60 * 60 * 1000) });
      default:
        throw new Error("Not supported yet.");
    }
  }
}