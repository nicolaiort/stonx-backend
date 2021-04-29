import {Optional, Required} from "@tsed/schema";

export class Wallet {
  @Optional()
  id: string;

  @Required()
  token: string;

  @Required()
  balance: number;

  @Optional()
  fiat: number;

  constructor(token: string, balance: number, price: number = 0, id?: string) {
    this.token = token;
    this.balance = balance;
    this.fiat = this.balance * price;
    if (id) {
      this.id = id;
    }
  }

  public set price(value: number) {
    this.fiat = this.balance * value;
  }
}
