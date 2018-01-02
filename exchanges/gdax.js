const axios = require('axios');
const Gdax = require('gdax');
const gdax = new Gdax.PublicClient();
const mapTicker = (name, bid, ask, market) => { return { name, bid, ask, market } };

gdax.secret = 'gKey';
gdax.privateKey = 'gSec';
gdax.fees = {
  maker: 0,
  taker: 0.0025
};
gdax.getTicker = () => axios.all([gdax.getProductTicker('ETH-BTC'), gdax.getProductTicker('LTC-BTC')])
  .then(axios.spread((eth, ltc) => {
    eth.name = 'ETHBTC';
    ltc.name = 'LTCBTC';
    return [eth, ltc].map((item) => mapTicker(item.name, item.bid, item.ask, 'gdax'));
  }))
  .catch((error) => {
    console.log(error);
  });

module.exports = gdax;