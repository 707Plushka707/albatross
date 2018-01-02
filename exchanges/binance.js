const axios = require('axios');
const Binance = require('binance');
const binance = new Binance.BinanceRest({key: '', secret: ''});
const mapTicker = (name, bid, ask, market) => { return { name, bid, ask, market } };

binance.secret = 'bKey';
binance.privateKey = 'bSec';
binance.fees = {
  maker: 0.001,
  taker: 0.001
};
binance.getTicker = () => axios.all([binance.allBookTickers()])
.then((response) => {
  const ticker = response[0].filter((c) => c.symbol === 'ETHBTC' || c.symbol === 'LTCBTC');
  return ticker.map((item) => mapTicker(item.symbol, item.bidPrice, item.askPrice, 'binance'));
})
.catch((error) => {
  console.log(error);
});

module.exports = binance;