const axios = require('axios');
// apis for each exchange
const Exchanges = require('./exchanges/exchanges');

// wallets for each exchange
const Wallets = require('./utils/wallets');

// math utilities
const Calc = require('./utils/calculations');

// constants
const TRIGGER = 0.001;

const init = () => {
  // get all exchange ticker data
  axios.all([ Exchanges.gdax.getTicker(), Exchanges.poloniex.getTicker(), Exchanges.binance.getTicker()])
  .then(axios.spread((gdax, poloniex, binance) => {
    // compare all possible market pairs for each coin - makes sure they arent undefined
    const trade = Calc.getTrade(Exchanges.groupByCoin([...gdax, ...poloniex, ...binance].filter((m) => m)), TRIGGER);
    
    if(trade) {
      // TODO: AL, what do we need to know here to make a trade?
      console.log('TRADING: ', trade);
      // TODO: Exec a trade, ONLY if wallet amounts will allow
      // TODO: Start the search again after the trade is complete.
      // init();
    } else {
      init();
    }
  })).catch(error => {
    console.log(error);
  });
};

init();
// loop = setInterval(init, TIME);