const Gdax = require('gdax');
const axios = require('axios');
const Poloniex = require('poloniex-api-node');
const Binance = require('binance');

const poloniex = new Poloniex();
const gdax = new Gdax.PublicClient('LTC-BTC');
const gdax2 = new Gdax.PublicClient('ETH-BTC');
const binance = new Binance.BinanceRest({key: '', secret: ''});

const mapTicker = (name, bid, ask, market) => { return { name, bid, ask, market } };

/* GDAX Exchange */
gdax.secret = 'gKey';
gdax.privateKey = 'gSec';
// TODO: gdax getTicker function

/* Poloniex Exchange */
poloniex.secret = 'pKey';
poloniex.privateKey = 'pSec';
poloniex.getTicker = () => axios.all([poloniex.returnTicker()])
  .then((response) => {
    const fullTicker = response[0];
    const ticker = [];

    for(coin in fullTicker) {
      if (coin === 'BTC_LTC' || coin === 'BTC_ETH') {
        fullTicker[coin].name = coin.split('_').reverse().join('');
        ticker.push(fullTicker[coin]);
      }
    }

    return ticker.map((item) => mapTicker(item.name, item.highestBid, item.lowestAsk, 'poloniex'));
  })
  .catch((error) => {
    console.log(error);
  });

/* Binance Exchange */
binance.secret = 'bKey';
binance.privateKey = 'bSec';
binance.getTicker = () => axios.all([binance.allBookTickers()])
.then((response) => {
  const ticker = response[0].filter((c) => c.symbol === 'ETHBTC' || c.symbol === 'LTCBTC');
  return ticker.map((item) => mapTicker(item.symbol, item.bidPrice, item.askPrice, 'binance'));
})
.catch((error) => {
  console.log(error);
});

module.exports = {
  gdax,
  gdax2,
  poloniex,
  binance
};