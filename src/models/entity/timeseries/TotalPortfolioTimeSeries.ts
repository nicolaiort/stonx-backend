import { Entity } from "typeorm";
import { User } from "../User";
import { TimeSeriesEntry } from "./TimeSeriesEntry";

@Entity()
export class TotalPortfolioTimeSeries extends TimeSeriesEntry {

  constructor(owner: User, timestamp: number, fiat_value: number) {
    super(owner, timestamp, -1, fiat_value);
  }
}