const poloniex = require('./poloniex');
const binance = require('./binance');
const gdax = require('./gdax');

const groupByCoin = (markets) => {
  const coins = {};

  markets.forEach((m) => {
    const market = { bid: m.bid, ask: m.ask, market: m.market, asset: m.asset, currency: m.currency };
    if(!coins[m.name]) {
      coins[m.name] = [market];
    } else {
      coins[m.name].push(market)
    }
  });

  return coins;
};

const fees = {
  'gdax': gdax.fees,
  'binance': binance.fees,
  'poloniex': poloniex.fees
};

module.exports = {
  gdax,
  poloniex,
  binance,
  groupByCoin,
  fees
};