const axios = require('axios');

// apis for each exchange
const Exchanges = require('./exchanges/exchanges');

// wallets for each exchange
const paperWallet = require('./utils/wallets');

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
      console.log('TRADING: ', trade);
      // TODO: exe a trade - exchange 1 (asset for cur) && exchange 2 (cur for asset) - check on this with al
      const tradeLog = Date.now() + ' Traded ' + trade.market1.asset + trade.market1.currency + ' between ' + trade.market1.market + ' and ' + trade.market2.market + ' for a net of ' + trade.net;
      // log trade and start over again
      log(tradeLog, 'trade_log.txt', init);
    } else {
      init();
    }
  })).catch(error => {
    console.log(error);
  });
};

init();