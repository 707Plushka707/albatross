const Gdax = require('gdax');
const axios = require('axios');
const Poloniex = require('poloniex-api-node');
const Binance = require('binance');

const poloniex = new Poloniex();
const gdax = new Gdax.PublicClient('LTC-BTC');
const gdax2 = new Gdax.PublicClient('ETH-BTC');
const binance = new Binance.BinanceRest({key: '', secret: ''});

gdax.secret = 'gKey';
gdax.privateKey = 'gSec';
// TODO: gdax getTicker function

poloniex.secret = 'pKey';
poloniex.privateKey = 'pSec';
poloniex.getTicker = () => axios.all([poloniex.returnTicker()])
  .then((response) => {
    const fullTicker = response[0];
    const ourTicker = [];

    for(coin in fullTicker) {
      if (coin === 'BTC_LTC' || coin === 'BTC_ETH') {
        fullTicker[coin].name = coin.split('_').reverse().join('');
        ourTicker.push(fullTicker[coin]);
      }
    }

    return ourTicker.map((item) => {
      return {
        name: item.name,
        bid: item.highestBid,
        ask: item.lowestAsk
      }
    });
  })
  .catch((error) => {
    console.log(error);
  });


binance.secret = 'bKey';
binance.privateKey = 'bSec';
// TODO: getTicker for binance
// binance.getTicker = binance.allBookTickers;

module.exports = {
  gdax,
  gdax2,
  poloniex,
  binance
};