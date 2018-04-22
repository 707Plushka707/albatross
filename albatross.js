// api helper
const axios = require("axios");
// apis for each exchange
const exchanges = require("./exchanges/exchanges");
// paper trader - for executing trades - local testing only - will add method to each exchange matching with api specs
const Trader = require("./utils/trader");
// handles all trades
const trader = new Trader(0.0003, 0.0025);
// count trades
let tradeCount = 0;
// wallets
let wallets = {};
// logger for writing trade data to txt
const Logger = require("./utils/logger");
const logger = new Logger();

const init = () => {
  // get all the wallet information here
  axios
    .all([exchanges.poloniex.getWallet(), exchanges.binance.getWallet()])
    .then(
      axios.spread((poloniexWallet, binanceWallet) => {
        // the real wallet available balances - without keys you will get empty objs
        wallets = {
          poloniex: poloniexWallet,
          binance: binanceWallet
        };
        // init log
        if (tradeCount === 0) {
          logger.log(
            "Start Trading\n\n" +
              logger.cleanJSON(JSON.stringify(wallets)) +
              "\n",
            "trade_log.txt",
            true,
            null
          );
        }
        // get the tickers for all exchanges you want to look at
        axios
          .all([exchanges.poloniex.getTicker(), exchanges.binance.getTicker()])
          .then(
            axios.spread((poloniex, binance) => {
              // compare all possible market pairs for each coin - makes sure they arent undefined
              const trade = trader.getTrade(
                exchanges.groupByCoin([...poloniex, ...binance].filter(m => m)),
                wallets
              );
              // exe a trade
              if (trade) {
                const sellExchange = exchanges[trade.market1.market];
                const buyExchange = exchanges[trade.market2.market];
                trade.count = tradeCount++;
                trader.executeTrade(
                  trade,
                  wallets,
                  sellExchange,
                  buyExchange,
                  tradeResults => {
                    logger.log(
                      logger.getTradeString(tradeResults),
                      "trade_log.txt",
                      false,
                      init
                    );
                  }
                );
              } else {
                // or look again
                init();
              }
            })
          )
          .catch(error => {
            console.log(error);
          });
      })
    )
    .catch(error => {
      console.log(error);
    });
};

// log the wallet on close
process.on("SIGINT", () => {
  logger.log(
    "\nEnd Trading\n" + logger.cleanJSON(JSON.stringify(wallets)),
    "trade_log.txt",
    true,
    process.exit
  );
});

// start looking for trades
init();
