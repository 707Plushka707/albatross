// GDAX We throttle public endpoints by IP: 3 requests per second, up to 6 requests per second in bursts.
const axios = require('axios');
const Gdax = require('gdax');
const Poloniex = require('poloniex-api-node');
let poloniex = new Poloniex();
const gdaxPublicClient = new Gdax.PublicClient('LTC-BTC');
const gdaxLTCUSD = new Gdax.PublicClient('LTC-USD');

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

const prices = {
  gdax: {},
  poloniex: {}
};

const getPrices = () => {
  axios.all([gdaxPublicClient.getProductTicker(), poloniex.returnTicker(), gdaxLTCUSD.getProductTicker()])
  .then(axios.spread((gdaxMrkt, poloniexMrkt, ltcUsd) => {
    prices['gdax']['LTC_BTC'] = gdaxMrkt.price;
    prices['gdax']['LTC_USD'] = ltcUsd.price;
    prices['poloniex']['LTC_BTC'] = poloniexMrkt['BTC_LTC'].last;
    console.log('===================');
    console.log(prices);
    console.log('RATIOS: G/P ', gdaxMrkt.price/poloniexMrkt['BTC_LTC'].last, 'P/G ', poloniexMrkt['BTC_LTC'].last/gdaxMrkt.price)
    console.log('NET GAINS: $' + calculateNet(gdaxMrkt.price, poloniexMrkt['BTC_LTC'].last, ltcUsd.price));
    console.log('===================');
  })).catch(error => {
    // handle the error
    console.log(error);
  });
};

const calculateNet = (gdaxPrice, poloniexPrice, usd) => {
  const fees = 0.0025;
  const ltcToBtc = gdaxAcc.LTC * gdaxPrice - (fees * gdaxAcc.LTC * gdaxPrice);
  const btcToLtc = ltcToBtc / poloniexPrice - (fees * ltcToBtc / poloniexPrice);
  const diffLtc = btcToLtc - gdaxAcc.LTC;
  const netGains = diffLtc * usd;
  // poloniexAcc.BTC -= ltcToBtc;
  // poloniexAcc.LTC += btcToLtc;
  return netGains;
}

setInterval(getPrices, 2000);