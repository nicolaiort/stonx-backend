# stonkx-backend

Information aggregation for some of your assets.
Powers the stonkx-frontend dashboard.

Powered by (among many others):
* [Ts.ED](https://tsed.io)
* [TypeORM](https://typeorm.io/)
* [Axios](https://axios-http.com/)
* [PassportJS](https://www.passportjs.org/)

## Supported assets
> Warning: We currently save your bitpanda api keys in plaintext in our DB

* Bitpanda Wallets (Needs a bitpanda api token that can read your assets)
* Bitpanda Indices (Needs a bitpanda api token that can read your assets)
* ETH Wallets (Only needs the public key/address)

## Configuration
> You can (or sometimes have to) use the following env vars to configure some parts of the backend
> This repository provides an .example.env file that contains all env vars

| Env var | Type | Optional | Default value | Description|
| - | - | - | - | - |
JWT_SECRET | String | No | empty | The secret used by the backend to sign jwts - Should be at least 32bits (Max 512) |
ETHERSCAN_APIKEY | String | No | empty | An api key for etherscan - the backend uses etherscan to get the balance of erc20 wallets - You can get one [here](https://etherscan.io/apis) |
CURRENCY | String | No | empty | Your local currency string (Tested with EUR and USD) |
ENABLE_SIGNUP | Boolan | Yes | true | Enable the aut/signup endpoint(true,default) or disable it |

## Dev Setup 🛠
```bash
yarn
yarn dev
```