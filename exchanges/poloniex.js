const axios = require('axios');
const Poloniex = require('poloniex-api-node');
const poloniex = new Poloniex();
const keys = require('./keys').poloniex;
const pairs = require('./pairs')
  .getExchangePairs('poloniex')
  .map(name =>
    name
      .split('-')
      .reverse()
      .join('_')
  );

const mapTicker = (name, bid, ask, market, asset, currency) => {
  return { name, bid, ask, market, asset, currency };
};

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
        if (pairs.indexOf(coin) >= 0) {
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
