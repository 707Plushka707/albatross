const axios = require('axios');
const Binance = require('binance');
const binance = new Binance.BinanceRest({ key: '', secret: '' });
const keys = require('./keys').binance;
const mapTicker = (name, bid, ask, market, asset, currency) => {
  return { name, bid, ask, market, asset, currency };
};
const coins = [
  'ETHBTC',
  'LTCBTC',
  'BTSBTC',
  'DASHBTC',
  'ETCETH',
  'GASBTC',
  'LSKBTC',
  'LSKETH',
  'NAVBTC',
  'OMGBTC',
  'OMGETH',
  'STORJBTC',
  'STRATBTC',
  'XMRBTC',
  'XRPBTC',
  'ZECBTC',
  'ZECETH',
  'ZRXBTC',
  'ZRXETH'
];
const currencies = ['BTC', 'ETH'];
binance.secret = keys.privateKey;
binance.privateKey = keys.secret;
binance.fees = {
  maker: 0.001,
  taker: 0.001
};
binance.getTicker = () =>
  axios
    .all([binance.allBookTickers()])
    .then(response => {
      const ticker = response[0].filter(c => coins.indexOf(c.symbol) >= 0);
      return ticker.map(item => {
        for (let i = 0; i < currencies.length; i++) {
          const c = currencies[i];
          if (item.symbol.indexOf(c) >= 0) {
            item.currency = c;
            item.asset = item.symbol.replace(c, '');
            break;
          }
        }

        return mapTicker(
          item.symbol,
          item.bidPrice,
          item.askPrice,
          'binance',
          item.asset,
          item.currency
        );
      });
    })
    .catch(error => {
      return [];
    });

module.exports = binance;
