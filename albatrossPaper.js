// api helper
const axios = require("axios");
// apis for each exchange
const exchanges = require("./exchanges/exchanges");
// paper trader - for executing trades - local testing only - will add method to each exchange matching with api specs
const Trader = require("./utils/trader");
// logger for writing trade data to txt
const Logger = require("./utils/logger");
// paper wallets for each exchange - local testing only - will use apis later
let paperWallet = require("./utils/wallets");

const logger = new Logger();

// init log
logger.log(
  "Start Trading\n\n" + logger.cleanJSON(JSON.stringify(paperWallet)) + "\n",
  "paper_trade_log.txt",
  true,
  null
);

// handles all trades
const paperTrader = new Trader();

// count trades
let tradeCount = 0;

const init = () => {
  // get all the wallet information here
  axios
    .all([exchanges.poloniex.getTicker(), exchanges.binance.getTicker()])
    .then(
      axios.spread((poloniex, binance) => {
        // compare all possible market pairs for each coin - makes sure they arent undefined
        const trade = paperTrader.getTrade(
          exchanges.groupByCoin([...poloniex, ...binance].filter(m => m)),
          paperWallet
        );

        if (trade) {
          // exe a paper trade
          const traded = paperTrader.executeTrade(trade, paperWallet);
          paperWallet = traded.newWallet;

          // trade count inc
          tradeCount++;
          trade.count = tradeCount;
          trade.data = traded.data;

          // non paper trade notes
          // sell on market 1, buy on market 2
          const sellExchange = exchanges[trade.market1.market];
          const buyExchange = exchanges[trade.market2.market];
          // log the trade and go again
          logger.log(
            logger.getTradeString(trade),
            "paper_trade_log.txt",
            false,
            init
          );
        } else {
          //  if no trade look again
          init();
        }
      })
    )
    .catch(error => {
      console.log(error);
    });
};

// log the wallet on close
process.on("SIGINT", () => {
  logger.log(
    "\nEnd Trading\n" + logger.cleanJSON(JSON.stringify(paperWallet)),
    "paper_trade_log.txt",
    true,
    process.exit
  );
});

// start looking for trades
init();
