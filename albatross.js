const axios = require('axios');
const Api = require('./exchanges/exchanges');
const TRIGGER = 0.001;
const TIME = 2000;
let loop;

// wallets
const gdaxAcc = {
  'BTC': 0,
  'LTC': 6,
  'ETH': 3
};

const poloniexAcc = {
  'BTC': 0.24,
  'LTC': 0,
  'ETH': 0
};

const initWatch = () => {
  // get all the info
  // , Api.gdax2.getProductTicker()Api.gdax.getProductTicker(),
  axios.all([ Api.poloniex.getTicker(), Api.binance.getTicker()])
  .then(axios.spread((poloniexMrkt, binance) => {
    // TODO: Null Check
    console.log([...poloniexMrkt, ...binance]);
    // TODO: Store in market obj
    // TODO: Run calcs - getMargin for each possible market pair and Log
    // sell 1 buy 2, sell 1 buy 3, sell 2 buy 1, sell 2 buy 3, sell 3 buy 1, sell 3 buy 2 per (ltc, eth)
    // TODO: if get margin meets trigger = update the wallets

    // if(!poloniexMrkt[coin2 + '_' + coin1] || !gdaxMrkt.price || !coin1USD.price) {
    //   console.log('Invalid coins entered');
    //   clearInterval(loop);
    //   return;
    // }
    // prices - temp logging
    // const coin1PoloniexPrice = poloniexMrkt[coin2 + '_' + coin1].last;
    // prices['gdax'][coin1 + '_' + coin2] = gdaxMrkt.price;
    // prices['gdax'][coin1 + '_USD'] = coin1USD.price;
    // prices['poloniex'][coin1 + '_' + coin2] = coin1PoloniexPrice;

    // output - calculates net
    // console.log('===================');
    // console.log(prices);
    // console.log('RATIOS: G/P ', gdaxMrkt.price/coin1PoloniexPrice, 'P/G ', coin1PoloniexPrice/gdaxMrkt.price)
    // console.log('NET GAINS: $' + calculateNet(coin1, coin2, gdaxMrkt.price, coin1PoloniexPrice, coin1USD.price));
    // console.log('===================');
  })).catch(error => {
    // handle the error
    console.log(error);
  });
};

// calculates net gains
// params: names of coin1 and coind2, price in either exchange and the usd val of coin1
const calculateNet = (coin1, coin2, gdaxPrice, poloniexPrice, usd) => {
  // trading fees - need to confirm values for each ex
  const fees = 0.0025;

  // gdax coin1 -> coin2 trade
  const c1Toc2 = gdaxAcc[coin1] * gdaxPrice - (fees * gdaxAcc[coin1] * gdaxPrice);
  
  // polo coin2 -> coin1 trade
  const c2Toc1 = c1Toc2 / poloniexPrice - (fees * c1Toc2 / poloniexPrice);
  
  // coin gained or lost
  const diff = c2Toc1 - gdaxAcc[coin1];
  const netGains = diff * usd;

  return netGains;
}

loop = setInterval(initWatch, TIME);