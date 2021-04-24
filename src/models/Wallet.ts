import {
    Optional,
    Required
} from "@tsed/schema";

export class Wallet {
    @Required()
    token: string;

    @Required()
    balance: number;
    
    @Optional()
    fiat: number;

    constructor(token: string, balance:number, price:number = 0){
        this.token=token;
        this.balance=balance;
        this.fiat=this.balance*price;
    }

    public set price(value:number){
        this.fiat=this.balance*value;
    }
}