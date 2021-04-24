import {Controller, Get} from "@tsed/common";
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
  async getWallets(): Promise<Wallet[]> {
    let wallets = (await axios.get('https://api.bitpanda.com/v1/wallets', {
        headers:{
            'X-API-KEY': config["BITPANDA_API_KEY"]
        }
    })).data.data;

    let returnWallets: Wallet[] = new Array<Wallet>();
    for(let wallet of wallets){
        returnWallets.push(new Wallet(wallet.attributes.cryptocoin_symbol, parseFloat(wallet.attributes.balance)))
    }
    return returnWallets;
  }
}