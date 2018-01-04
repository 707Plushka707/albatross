const axios = require('axios');
const Gdax = require('gdax');
const gdax = new Gdax.PublicClient();
const mapTicker = (name, bid, ask, market, asset, currency) => { return { name, bid, ask, market, asset, currency } };

gdax.secret = 'gKey';
gdax.privateKey = 'gSec';
gdax.fees = {
  maker: 0,
  taker: 0.0025
};
gdax.getTicker = () => axios.all([gdax.getProductTicker('ETH-BTC'), gdax.getProductTicker('LTC-BTC')])
  .then(axios.spread((eth, ltc) => {
    eth.name = 'ETHBTC';
    eth.asset = 'ETH';
    eth.currency = 'BTC';
    ltc.name = 'LTCBTC';
    ltc.asset = 'LTC';
    ltc.currency = 'BTC';
    return [eth, ltc].map((item) => mapTicker(item.name, item.bid, item.ask, 'gdax', item.asset, item.currency));
  }))
  .catch((error) => {
    console.log(error);
  });

module.exports = gdax;