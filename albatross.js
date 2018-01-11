// api helper
const axios = require('axios');
// apis for each exchange
const exchanges = require('./exchanges/exchanges');
// paper trader - for executing trades - local testing only - will add method to each exchange matching with api specs
const Trader = require('./utils/trader');
// logger for writing trade data to txt
const Logger = require('./utils/logger');
// paper wallets for each exchange - local testing only - will use apis later
let paperWallet = require('./utils/wallets');

const logger = new Logger();
const paperTrader = new Trader();
let logStr = '';

const init = () => {
  // start logging with init wallet amount for paper trading
  if (logStr === '') {
    logStr += '$tart Trading\n\n' + JSON.stringify(paperWallet) + '\n\n';
  }

  // get all exchange ticker data
  axios
    .all([
      exchanges.gdax.getTicker(),
      exchanges.poloniex.getTicker(),
      exchanges.binance.getTicker()
    ])
    .then(
      axios.spread((gdax, poloniex, binance) => {
        // compare all possible market pairs for each coin - makes sure they arent undefined
        const trade = paperTrader.getTrade(
          exchanges.groupByCoin(
            [...gdax, ...poloniex, ...binance].filter(m => m)
          ),
          paperWallet
        );

        if (trade) {
          // before trade log
          logStr += logger.getTradeString(trade, paperWallet, true);

          // exe a trade
          paperWallet = paperTrader.executeTrade(trade, paperWallet);

          // after trade log
          logStr += logger.getTradeString(trade, paperWallet, false);
        }

        init();
      })
    )
    .catch(error => {
      // just look again
      init();
    });
};

// log the wallet on close
process.on('SIGINT', () => {
  logger.log(
    logStr + '\n' + JSON.stringify(paperWallet),
    'trade_log.txt',
    true,
    process.exit
  );
});

// start looking for trades
init();
