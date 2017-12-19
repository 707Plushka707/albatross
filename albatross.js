const axios = require('axios');
const Gdax = require('gdax');
const Poloniex = require('poloniex-api-node');
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

// keeps track of prices for reporting temporarily
const prices = {
  gdax: {},
  poloniex: {}
};

const watchPair = (coin1, coin2) => {
  // apis
  const poloniex = new Poloniex();
  const gdaxCoin1USD = new Gdax.PublicClient(coin1 + '-USD');
  const gdaxCoin1 = new Gdax.PublicClient(coin1 + '-' + coin2);

  // get all the info
  axios.all([gdaxCoin1.getProductTicker(), poloniex.returnTicker(), gdaxCoin1USD.getProductTicker()])
  .then(axios.spread((gdaxMrkt, poloniexMrkt, coin1USD) => {
    // exit if market doesnt exist end loop
    if(!poloniexMrkt[coin2 + '_' + coin1] || !gdaxMrkt || !gdaxCoin1USD) {
      console.log('Invalid coins entered');
      clearInterval(loop);
      return;
    }
    // prices - temp logging
    const coin1PoloniexPrice = poloniexMrkt[coin2 + '_' + coin1].last;
    prices['gdax'][coin1 + '_' + coin2] = gdaxMrkt.price;
    prices['gdax'][coin1 + '_USD'] = coin1USD.price;
    prices['poloniex'][coin1 + '_' + coin2] = coin1PoloniexPrice;

    // output - calculates net
    console.log('===================');
    console.log(prices);
    console.log('RATIOS: G/P ', gdaxMrkt.price/coin1PoloniexPrice, 'P/G ', coin1PoloniexPrice/gdaxMrkt.price)
    console.log('NET GAINS: $' + calculateNet(coin1, coin2, gdaxMrkt.price, coin1PoloniexPrice, coin1USD.price));
    console.log('===================');
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

if(process.argv[2] && process.argv[3]) {
  const c1 = process.argv[2].toUpperCase();
  const c2 = process.argv[3].toUpperCase();
  
  loop = setInterval(() => {
    watchPair(c1, c2);
  }, 2000);
} else {
  console.log('Please enter coins to monitor');
}
