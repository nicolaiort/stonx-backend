import { TimeSeriesEntry } from "src/models/entity/timeseries/TimeSeriesEntry";
import { getConnectionManager, MoreThan, Repository } from "typeorm";
import { CryptoWalletTimeSeries } from "../../models/entity/timeseries/CryptoWalletTimeSeries";
import { ExchangeAssetTimeSeries } from "../../models/entity/timeseries/ExchangeAssetTimeSeries";
import { TotalPortfolioTimeSeries } from "../../models/entity/timeseries/TotalPortfolioTimeSeries";
import { User } from "../../models/entity/User";
import { SupportedExchanges } from "../../models/enums/SupportedExchanges";
import { SupportedTokens } from "../../models/enums/SupportedTokens";
import { TimeSeriesRanges } from "../../models/enums/TimeSeriesRanges";

/**
 * Implements all functions needed to interact with TimeSeries data.
 */
export class TimeSeriesService {

  private walletTimeSeriesService: Repository<CryptoWalletTimeSeries>;
  private exchangeTimeSeriesService: Repository<ExchangeAssetTimeSeries>;
  private portfolioTimeSeriesService: Repository<TotalPortfolioTimeSeries>;

  constructor() {
    this.walletTimeSeriesService = getConnectionManager().get().getRepository(CryptoWalletTimeSeries);
    this.exchangeTimeSeriesService = getConnectionManager().get().getRepository(ExchangeAssetTimeSeries);
    this.portfolioTimeSeriesService = getConnectionManager().get().getRepository(TotalPortfolioTimeSeries);
  }

  /**
   * Create a new exchange timeseries datapoint.
   * @param datapoint The new datapoint.
   * @returns The datapoint entity wrapped in a repository.save promise.
   */
  public async saveExchangeDatapoint(datapoint: ExchangeAssetTimeSeries) {
    return this.exchangeTimeSeriesService.save(datapoint);
  }

  /**
   * Create a new wallet timeseries datapoint.
   * @param datapoint The new datapoint.
   * @returns The datapoint entity wrapped in a repository.save promise.
   */
  public async saveWalletDatapoint(datapoint: CryptoWalletTimeSeries) {
    return this.walletTimeSeriesService.save(datapoint);
  }

  /**
   * Create a new portfolio timeseries datapoint.
   * @param datapoint The new datapoint.
   * @returns The datapoint entity wrapped in a repository.save promise.
   */
  public async savePortfolioDatapoint(datapoint: TotalPortfolioTimeSeries) {
    return this.portfolioTimeSeriesService.save(datapoint);
  }

  /**
   * Provides you with the timeseries datapoints for bitpanda assets in various ranges.
   * @param owner The asset's owner.
   * @param asset The asset's name (token or index)
   * @param range The range in which you want your results to reside in.
   * @returns An array of timeseries datapoints wrapped in a Promise.
   */
  public async findBitpandaAssetByUserAndRange(owner: User, asset: string, range: TimeSeriesRanges): Promise<ExchangeAssetTimeSeries[]> {
    const now = new Date();
    switch (range) {
      case TimeSeriesRanges.ALL:
        const all = await this.exchangeTimeSeriesService.find({ owner_id: owner.id, asset_name: asset, exchange: SupportedExchanges.BITPANDA });
        return this.filterExchangeForMidnight(all);
      case TimeSeriesRanges.THISYEAR:
        now.setFullYear(now.getFullYear() - 1);
        const allInYear = await this.exchangeTimeSeriesService.find({ owner_id: owner.id, asset_name: asset, exchange: SupportedExchanges.BITPANDA, timestamp: MoreThan(now.getTime()) })
        return this.filterExchangeForMidnight(allInYear);
      case TimeSeriesRanges.THISMONTH:
        now.setMonth(now.getMonth() - 1);
        const allInMonth = await this.exchangeTimeSeriesService.find({ owner_id: owner.id, asset_name: asset, exchange: SupportedExchanges.BITPANDA, timestamp: MoreThan(now.getTime()) })
        return this.filterExchangeForMidnight(allInMonth);
      case TimeSeriesRanges.THISWEEK:
        now.setDate(now.getDate() - 7);
        const allInWeek = await this.exchangeTimeSeriesService.find({ owner_id: owner.id, asset_name: asset, exchange: SupportedExchanges.BITPANDA, timestamp: MoreThan(now.getTime()) })
        return this.filterExchangeForMidnight(allInWeek);
      case TimeSeriesRanges.TODAY:
        return this.exchangeTimeSeriesService.find({ owner_id: owner.id, asset_name: asset, exchange: SupportedExchanges.BITPANDA, timestamp: MoreThan(now.getTime() - 24 * 60 * 60 * 1000) });
      default:
        throw new Error("Not supported yet.");
    }
  }

  /**
   * Provides you with the timeseries datapoints for binance assets in various ranges.
   * @param owner The asset's owner.
   * @param asset The asset's name (token)
   * @param range The range in which you want your results to reside in.
   * @returns An array of timeseries datapoints wrapped in a Promise.
   */
  public async findBinanceSpotWalletsByUserAndRange(owner: User, asset: string, range: TimeSeriesRanges): Promise<ExchangeAssetTimeSeries[]> {
    const now = new Date();
    switch (range) {
      case TimeSeriesRanges.ALL:
        const all = await this.exchangeTimeSeriesService.find({ owner_id: owner.id, asset_name: asset, exchange: SupportedExchanges.BINANCE });
        return this.filterExchangeForMidnight(all);
      case TimeSeriesRanges.THISYEAR:
        now.setFullYear(now.getFullYear() - 1);
        const allInYear = await this.exchangeTimeSeriesService.find({ owner_id: owner.id, asset_name: asset, exchange: SupportedExchanges.BINANCE, timestamp: MoreThan(now.getTime()) })
        return this.filterExchangeForMidnight(allInYear);
      case TimeSeriesRanges.THISMONTH:
        now.setMonth(now.getMonth() - 1);
        const allInMonth = await this.exchangeTimeSeriesService.find({ owner_id: owner.id, asset_name: asset, exchange: SupportedExchanges.BINANCE, timestamp: MoreThan(now.getTime()) })
        return this.filterExchangeForMidnight(allInMonth);
      case TimeSeriesRanges.THISWEEK:
        now.setDate(now.getDate() - 7);
        const allInWeek = await this.exchangeTimeSeriesService.find({ owner_id: owner.id, asset_name: asset, exchange: SupportedExchanges.BINANCE, timestamp: MoreThan(now.getTime()) })
        return this.filterExchangeForMidnight(allInWeek);
      case TimeSeriesRanges.TODAY:
        return this.exchangeTimeSeriesService.find({ owner_id: owner.id, asset_name: asset, exchange: SupportedExchanges.BINANCE, timestamp: MoreThan(now.getTime() - 24 * 60 * 60 * 1000) });
      default:
        throw new Error("Not supported yet.");
    }
  }

  /**
   * Provides you with the timeseries datapoints for custom wallets in various ranges.
   * @param owner The wallet entry's owner.
   * @param token The wallet's token.
   * @param id The wallet's id.
   * @param range The range in which you want your results to reside in.
   * @returns An array of timeseries datapoints wrapped in a Promise.
   */
  public async findWalletByIdUserTokenAndRange(owner: User, token: SupportedTokens, id: string, range: TimeSeriesRanges): Promise<CryptoWalletTimeSeries[]> {
    const now = new Date();
    switch (range) {
      case TimeSeriesRanges.ALL:
        const all = await this.walletTimeSeriesService.find({ owner_id: owner.id, token: token, wallet_id: id });
        return this.filterWalletForMidnight(all);
      case TimeSeriesRanges.THISYEAR:
        now.setFullYear(now.getFullYear() - 1);
        const allInYear = await this.walletTimeSeriesService.find({ owner_id: owner.id, token: token, wallet_id: id, timestamp: MoreThan(now.getTime()) })
        return this.filterWalletForMidnight(allInYear);
      case TimeSeriesRanges.THISMONTH:
        now.setMonth(now.getMonth() - 1);
        const allInMonth = await this.walletTimeSeriesService.find({ owner_id: owner.id, token: token, wallet_id: id, timestamp: MoreThan(now.getTime()) })
        return this.filterWalletForMidnight(allInMonth);
      case TimeSeriesRanges.THISWEEK:
        now.setDate(now.getDate() - 7);
        const allInWeek = await this.walletTimeSeriesService.find({ owner_id: owner.id, token: token, wallet_id: id, timestamp: MoreThan(now.getTime()) })
        return this.filterWalletForMidnight(allInWeek);
      case TimeSeriesRanges.TODAY:
        return this.walletTimeSeriesService.find({ owner_id: owner.id, token: token, wallet_id: id, timestamp: MoreThan(now.getTime() - 24 * 60 * 60 * 1000) });
      default:
        throw new Error("Not supported yet.");
    }
  }

  /**
   * Provides you with the timeseries datapoints for the whole portfolio in various ranges.
   * @param owner The portfolios's owner.
   * @param range The range in which you want your results to reside in.
   * @returns An array of timeseries datapoints wrapped in a Promise.
   */
  public async findPortfolioByOwner(owner: User, range: TimeSeriesRanges): Promise<TotalPortfolioTimeSeries[]> {
    const now = new Date();
    switch (range) {
      case TimeSeriesRanges.ALL:
        const all = await this.portfolioTimeSeriesService.find({ owner_id: owner.id });
        return this.filterForMidnight(all);
      case TimeSeriesRanges.THISYEAR:
        now.setFullYear(now.getFullYear() - 1);
        const allInYear = await this.portfolioTimeSeriesService.find({ owner_id: owner.id, timestamp: MoreThan(now.getTime()) })
        return this.filterForMidnight(allInYear);
      case TimeSeriesRanges.THISMONTH:
        now.setMonth(now.getMonth() - 1);
        const allInMonth = await this.portfolioTimeSeriesService.find({ owner_id: owner.id, timestamp: MoreThan(now.getTime()) })
        return this.filterForMidnight(allInMonth);
      case TimeSeriesRanges.THISWEEK:
        now.setDate(now.getDate() - 7);
        const allInWeek = await this.portfolioTimeSeriesService.find({ owner_id: owner.id, timestamp: MoreThan(now.getTime()) })
        return this.filterForMidnight(allInWeek);
      case TimeSeriesRanges.TODAY:
        return this.portfolioTimeSeriesService.find({ owner_id: owner.id, timestamp: MoreThan(now.getTime() - 24 * 60 * 60 * 1000) });
      default:
        throw new Error("Not supported yet.");
    }
  }

  private filterForMidnight(array: Array<TimeSeriesEntry>): Array<TimeSeriesEntry> {
    return array.filter((d) => {
      if (isNaN(d.timestamp)) {
        d.timestamp = parseInt(d.timestamp.toString());
      }
      let date = new Date(d.timestamp);
      return date.getHours() == 0 && date.getMinutes() == 0;
    });
  }

  private filterWalletForMidnight(array: Array<CryptoWalletTimeSeries>): Array<CryptoWalletTimeSeries> {
    return array.filter((d) => {
      if (isNaN(d.timestamp)) {
        d.timestamp = parseInt(d.timestamp.toString());
      }
      let date = new Date(d.timestamp);
      return date.getHours() == 0 && date.getMinutes() == 0;
    });
  }

  private filterExchangeForMidnight(array: Array<ExchangeAssetTimeSeries>): Array<ExchangeAssetTimeSeries> {
    return array.filter((d) => {
      if (isNaN(d.timestamp)) {
        d.timestamp = parseInt(d.timestamp.toString());
      }
      let date = new Date(d.timestamp);
      return date.getHours() == 0 && date.getMinutes() == 0;
    });
  }
}