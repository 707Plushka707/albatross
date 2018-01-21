const poloniex = require('./poloniex');
const binance = require('./binance');
const bittrex = require('./bittrex');
const gdax = require('./gdax');
const precisions = require('./pairs').precisions;

const groupByCoin = markets => {
  const coins = {};

  markets.forEach(m => {
    const market = {
      bid: m.bid,
      ask: m.ask,
      market: m.market,
      asset: m.asset,
      currency: m.currency
    };
    if (!coins[m.name]) {
      coins[m.name] = [market];
    } else {
      coins[m.name].push(market);
    }
  });

  return coins;
};

const fees = {
  gdax: gdax.fees,
  binance: binance.fees,
  bittrex: bittrex.fees,
  poloniex: poloniex.fees
};

module.exports = {
  gdax,
  bittrex,
  poloniex,
  binance,
  groupByCoin,
  fees,
  precisions
};