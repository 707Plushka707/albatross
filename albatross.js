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
    const trade = Calc.getTrade(Exchanges.groupByCoin([...gdax, ...poloniex, ...binance].filter((m) => m)), TRIGGER);
    
    if(trade) {
      // Stop the loop
      clearInterval(loop);
      // TODO: AL, what do we need to know here to make a trade?
      console.log('TRADING: ', trade);
      // TODO: Exec a trade, ONLY if wallet amounts will allow
      // TODO: Start the loop again after the trade is complete.
      // loop = setInterval(init, TIME);
    } else {
      // Continue on - placeholder logging for now - ideally this wouldn't even be there.
      console.log('NO TRADE AVAILABLE ON THIS LOOP ITERATION');
    }
  })).catch(error => {
    console.log(error);
  });
};

loop = setInterval(init, TIME);