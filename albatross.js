const axios = require('axios');
// apis for each exchange
const Exchanges = require('./exchanges/exchanges');

// wallets for each exchange
const Wallets = require('./utils/wallets');

// math utilities
const Calc = require('./utils/calculations');

// constants
const TRIGGER = 0.001;
const TIME = 2000;

// for timer
let loop;

const init = () => {
  // get all exchange ticker data
  axios.all([ Exchanges.gdax.getTicker(), Exchanges.poloniex.getTicker(), Exchanges.binance.getTicker()])
  .then(axios.spread((gdax, poloniex, binance) => {
    // compare all possible market pairs for each coin - makes sure they arent undefined
    Calc.compare(Exchanges.groupByCoin([...gdax, ...poloniex, ...binance].filter((m) => m)), TRIGGER, Wallets);
  })).catch(error => {
    console.log(error);
  });
};

loop = setInterval(init, TIME);