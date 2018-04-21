// api helper
const axios = require("axios");
// apis for each exchange
const exchanges = require("./exchanges/exchanges");
// paper trader - for executing trades - local testing only - will add method to each exchange matching with api specs
const Trader = require("./utils/trader");
// logger for writing trade data to txt
const Logger = require("./utils/logger");
const logger = new Logger();
// paper wallets for each exchange - local testing only - will use apis later
let wallets = require("./utils/wallets");

// init log
logger.log(
  "Start Trading\n\n" + logger.cleanJSON(JSON.stringify(wallets)) + "\n",
  "paper_trade_log.txt",
  true,
  null
);

// handles all trades
const trader = new Trader(0.0003, 0.0025);

// count trades
let tradeCount = 0;

const init = () => {
  // get all the wallet information here
  axios
    .all([exchanges.poloniex.getTicker(), exchanges.binance.getTicker()])
    .then(
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
              const tradeResults = trader.executePaperTrade(trade, wallets);
              trade.count = tradeCount++;
              paperWallet = tradeResults.paperWallet;
              trade.data = tradeResults.data;
              // log the trade and go again
              logger.log(
                logger.getTradeString(trade),
                "paper_trade_log.txt",
                false,
                init
              );
            } else {
              // or look again
              init();
            }
          })
        )
        .catch(error => {
          console.log(error);
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
    "paper_trade_log.txt",
    true,
    process.exit
  );
});

// start looking for trades
init();
