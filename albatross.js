const axios = require('axios');

// apis for each exchange
const Exchanges = require('./exchanges/exchanges');

// paper wallets for each exchange - local testing only - will use apis later
const paperWallet = require('./utils/wallets');

// paper trader - for executing trades - local testing only - will add method to each exchange matching with api specs
const paperTrader = require('./utils/trader');

// math utilities
const Calc = require('./utils/calculations');

// logger
const log = require('./utils/logger');

const init = () => {
  // get all exchange ticker data
  axios.all([ Exchanges.gdax.getTicker(), Exchanges.poloniex.getTicker(), Exchanges.binance.getTicker()])
  .then(axios.spread((gdax, poloniex, binance) => {
    // compare all possible market pairs for each coin - makes sure they arent undefined
    const trade = Calc.getTrade(Exchanges.groupByCoin([...gdax, ...poloniex, ...binance].filter((m) => m)), paperWallet);

    if (trade) {
      // execute a trade - paper only for local testing - apis later
      paperWallet = paperTrader.execute(trade, paperWallet);
      
      // log trade and start over again
      const tradeLog = Date.now() + ' Traded ' + trade.market1.asset + trade.market1.currency + ' between ' + trade.market1.market + ' and ' + trade.market2.market + ' for a net of ' + trade.net;
      log(tradeLog, 'trade_log.txt', init);
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
