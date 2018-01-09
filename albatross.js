const axios = require('axios');

// apis for each exchange
const Exchanges = require('./exchanges/exchanges');

// paper wallets for each exchange - local testing only - will use apis later
let paperWallet = require('./utils/wallets');

// paper trader - for executing trades - local testing only - will add method to each exchange matching with api specs
const paperTrader = require('./utils/trader');

// math utilities
const Calc = require('./utils/calculations');

// logger
const log = require('./utils/logger');
let runs = 0;

const init = () => {
  // start logging with init wallet amount for paper trading
  if(runs === 0) {
    log('$$$$$$$$======STARTING AN ALBATROSS SESSION=======$$$$$$\n', 'trade_log.txt', true, null);
  }
  
  // keeps track of the runs on init
  runs++;

  // get all exchange ticker data
  axios.all([ Exchanges.gdax.getTicker(), Exchanges.poloniex.getTicker(), Exchanges.binance.getTicker()])
  .then(axios.spread((gdax, poloniex, binance) => {
    // compare all possible market pairs for each coin - makes sure they arent undefined
    const trade = Calc.getTrade(Exchanges.groupByCoin([...gdax, ...poloniex, ...binance].filter((m) => m)), paperWallet);

    if (trade) {
      // before trade log
      log(log.getTradeString(trade, paperWallet, true), 'trade_log.txt', true, init);

      // exe a trade
      paperWallet = paperTrader.execute(trade, paperWallet);

      // after trade log
      log(log.getTradeString(trade, paperWallet, false), 'trade_log.txt', false, init);
    } else {
      // else look again for another trade
      init();
    }
  })).catch(error => {
    console.log(error);
  });
};

// start looking for trades
init();
