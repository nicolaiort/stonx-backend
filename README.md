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

## Dev Setup 🛠
```bash
yarn
yarn dev
```