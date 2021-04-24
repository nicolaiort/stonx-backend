import {
    Required
} from "@tsed/schema";

export class Wallet {
    @Required()
    coin: string;

    @Required()
    balance: number;

    constructor(coin: string, balance:number){
        this.coin=coin;
        this.balance=balance;
    }
}