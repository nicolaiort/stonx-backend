import {Controller, Get, QueryParams} from "@tsed/common";
import { Description, Returns } from "@tsed/schema";
import axios from "axios";
import { config } from "src/config/env";
import { Wallet } from "src/models/Wallet";

@Controller("/bitpanda")
export class BitpandaController {
  @Get("/ticker")
  async findAll(): Promise<string> {
    let ticker:Map<string, object> = await axios.get('https://api.bitpanda.com/v1/ticker');
    return ticker.keys.toString();
  }

  @Get("/wallets")
  @Description("Returns your bitpanda wallets by coin with balance.")
  @Returns(200, Wallet)
  async getWallets(@QueryParams("withEmpty") withEmpty: boolean = false): Promise<Wallet[]> {
    let wallets = (await axios.get('https://api.bitpanda.com/v1/wallets', {
        headers:{
            'X-API-KEY': config["BITPANDA_API_KEY"]
        }
    })).data.data;

    let returnWallets: Wallet[] = new Array<Wallet>();

    for(let wallet of wallets){
        if(!withEmpty && parseFloat(wallet.attributes.balance)!=0){
            returnWallets.push(new Wallet(wallet.attributes.cryptocoin_symbol, parseFloat(wallet.attributes.balance)))
        }
    }

    return returnWallets;
  }
}