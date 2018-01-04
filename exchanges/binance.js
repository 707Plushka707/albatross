const axios = require('axios');
const Binance = require('binance');
const binance = new Binance.BinanceRest({key: '', secret: ''});
const mapTicker = (name, bid, ask, market, asset, currency) => { return { name, bid, ask, market, asset, currency } };
const coins = ['ETHBTC', 'LTCBTC'];
const currencies = ['BTC'];
binance.secret = 'bKey';
binance.privateKey = 'bSec';
binance.fees = {
  maker: 0.001,
  taker: 0.001
};
binance.getTicker = () => axios.all([binance.allBookTickers()])
.then((response) => {
  const ticker = response[0].filter((c) => coins.indexOf(c.symbol) >= 0);
  return ticker.map((item) => {
    for(let i = 0; i < currencies.length; i++) {
      const c = currencies[i];
      if(item.symbol.indexOf(c) >= 0) {
        item.currency = c;
        item.asset = item.symbol.replace(c, '');
        break;
      }
    }
    mapTicker(item.symbol, item.bidPrice, item.askPrice, 'binance', item.asset, item.currency);
  });
})
.catch((error) => {
  console.log(error);
});

module.exports = binance;