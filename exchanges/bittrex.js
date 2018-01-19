const axios = require('axios');
const bittrex = require('node-bittrex-api');
const keys = require('./keys').bittrex;

bittrex.options({
  apikey: keys.privateKey,
  apisecret: keys.secret,
  verbose: false,
  cleartext: false
});

const pairs = require('./pairs')
  .getExchangePairs('bittrex')
  .map(name =>
    name
      .split('-')
      .reverse()
      .join('-')
  );

const mapTicker = (name, bid, ask, market, asset, currency) => {
  return { name, bid, ask, market, asset, currency };
};

bittrex.fees = {
  maker: 0.0025,
  taker: 0.0025
};

const getTickerData = param => {
  return new Promise((resolve, reject) => {
    bittrex.getticker(param, (data, err) => {
      if (err !== null) return reject(err);
      resolve([param, data]);
    });
  });
};

const buy = param => {
  return new Promise((resolve, reject) => {
    bittrex.buymarket(param, (data, err) => {
      if (err !== null) return reject(err);
      resolve(data);
    });
  });
};

const sell = param => {
  return new Promise((resolve, reject) => {
    bittrex.buymarket(param, (data, err) => {
      if (err !== null) return reject(err);
      resolve(data);
    });
  });
};

const getOrders = param => {
  return new Promise((resolve, reject) => {
    bittrex.getopenorders(param, (data, err) => {
      if (err !== null) return reject(err);
      resolve(data);
    });
  });
};

const getMarkets = () => {
  return new Promise((resolve, reject) => {
    bittrex.getmarketsummaries((data, err) => {
      if (err) {
        return reject(err);
      }
      return resolve(data);
    });
  });
};

bittrex.getTicker = () =>
  axios
    .all([getMarkets()])
    .then(data => {
      const promises = [];
      const marketHistory = data[0].result;

      for (let coin in marketHistory) {
        // if you can trade this coin
        if (pairs.indexOf(marketHistory[coin].MarketName) >= 0) {
          promises.push(
            getTickerData({ market: marketHistory[coin].MarketName })
          );
        }
      }

      return Promise.all(promises)
        .then(data => {
          const ticker = [];

          data.forEach(t => {
            const market = t[0].market;
            const data = t[1].result;
            ticker.push(
              mapTicker(
                market
                  .split('-')
                  .reverse()
                  .join(''),
                data.Bid,
                data.Ask,
                'bittrex',
                market.split('-').pop(),
                market.split('-').shift()
              )
            );
          });

          return ticker;
        })
        .catch(error => {
          return [];
        });
    })
    .catch(error => {
      return [];
    });

/*
    Trading
    Params
    pair: coin pair object. for this exchange its in the format CURR-ASSET ex: BTC-LTC
    rate: the price
    amount: the amount to buy or sell
    fillOrKill: either fills order immediately in full or aborts. Set to 1 to activate
*/

bittrex.buyOrder = (pair, rate, amount, fillOrKill = 0) =>
  buy({
    market: pair.currency + '-' + pair.asset,
    rate,
    quantity: amount
  });

bittrex.sellOrder = (pair, rate, amount, fillOrKill = 0) =>
  sell({
    market: pair.currency + '-' + pair.asset,
    rate,
    quantity: amount
  });

bittrex.checkOrder = pair =>
  getOrders({ market: pair.currency + '-' + pair.asset });

module.exports = bittrex;
