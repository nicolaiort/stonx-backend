import { isString } from "@tsed/core";
import { Required } from "@tsed/schema";

export class BinanceTradingPair {
    @Required()
    symbol: string;

    @Required()
    price: number;

    constructor(symbol: string, price: string | number) {
        this.symbol = symbol;
        if (isString(price)) {
            price = parseFloat(price);
        }
        this.price = price;
    }
}