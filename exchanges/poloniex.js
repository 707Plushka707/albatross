const axios = require('axios');
const Poloniex = require('poloniex-api-node');
const poloniex = new Poloniex();
const keys = require('./keys').poloniex;
const mapTicker = (name, bid, ask, market, asset, currency) => {
  return { name, bid, ask, market, asset, currency };
};
const coins = [
  'BTC_LTC',
  'BTC_ETH',
  'BTC_BTS',
  'BTC_DASH',
  'ETH_ETC',
  'BTC_GAS',
  'BTC_LSK',
  'ETH_LSK',
  'BTC_NAV',
  'BTC_OMG',
  'ETH_OMG',
  'BTC_STORJ',
  'BTC_STRAT',
  'BTC_XMR',
  'BTC_XRP',
  'BTC_ZEC',
  'ETH_ZEC',
  'BTC_ZRX',
  'ETH_ZRX'
];
poloniex.secret = keys.privateKey;
poloniex.privateKey = keys.secret;
poloniex.fees = {
  maker: 0.0015,
  taker: 0.0025
};
poloniex.getTicker = () =>
  axios
    .all([poloniex.returnTicker()])
    .then(response => {
      const fullTicker = response[0];
      const ticker = [];

      for (coin in fullTicker) {
        if (coins.indexOf(coin) >= 0) {
          fullTicker[coin].name = coin
            .split('_')
            .reverse()
            .join('');
          fullTicker[coin].asset = coin.split('_').pop();
          fullTicker[coin].currency = coin.split('_').shift();
          ticker.push(fullTicker[coin]);
        }
      }

      return ticker.map(item =>
        mapTicker(
          item.name,
          item.highestBid,
          item.lowestAsk,
          'poloniex',
          item.asset,
          item.currency
        )
      );
    })
    .catch(error => {
      return [];
    });

module.exports = poloniex;
