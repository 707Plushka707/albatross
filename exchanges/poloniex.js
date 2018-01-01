const axios = require('axios');
const Poloniex = require('poloniex-api-node');
const poloniex = new Poloniex();
const mapTicker = (name, bid, ask, market) => { return { name, bid, ask, market } };

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

module.exports = poloniex;