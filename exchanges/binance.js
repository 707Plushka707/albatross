const axios = require('axios');
const Binance = require('binance');
const keys = require('./keys').binance;
const binance = new Binance.BinanceRest({
  key: keys.privateKey,
  secret: keys.secret
});
const pairs = require('./pairs').getExchangePairs('binance');
const coins = pairs.map(name => name.replace('-', ''));
const currencies = pairs.reduce((currs, name) => {
  const currency = name.split('-').pop();
  if (currs.indexOf(currency) < 0) {
    currs.push(currency);
  }
  return currs;
}, []);

const mapTicker = (name, bid, ask, market, asset, currency) => {
  return {
    name,
    bid,
    ask,
    market,
    asset,
    currency
  };
};

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

binance.getWallet = () =>
  axios
  .all([binance.account()])
  .then(response => {
    const allBalances = response[0].balances;
    const wallet = {};

    for (let i = 0; i < pairs.length; i++) {
      const asset = pairs[i].split('-')[0];
      wallet[asset] = parseFloat(allBalances.filter(b => b.asset === asset).pop().free);
    }

    return wallet;
  })
  .catch(error => {
    return {};
  });

/*
    Trading
    Params
    pair: coin pair object. for this exchange its in the format ASSETCURR ex: ETHBTC
    rate: the price
    amount: the amount to buy or sell
    fillOrKill: either fills order immediately in full or aborts. Set to 1 to activate
*/
binance.buyOrder = (pair, rate, amount, fillOrKill = 0) =>
  binance.newOrder({
    symbol: pair.asset + pair.currency,
    side: 'BUY',
    type: 'MARKET',
    quantity: amount,
    timestamp: Date.now()
  });

binance.sellOrder = (pair, rate, amount, fillOrKill = 0) =>
  binance.newOrder({
    symbol: pair.asset + pair.currency,
    side: 'SELL',
    type: 'MARKET',
    quantity: amount,
    timestamp: Date.now()
  });

binance.checkOrder = pair => binance.openOrders(pair.asset + pair.currency);

module.exports = binance;