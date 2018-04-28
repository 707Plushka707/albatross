// api helper
const axios = require('axios');
const FEES = require('./../exchanges/exchanges').fees;
const PRECISIONS = require('./../exchanges/exchanges').precisions;

/* Used to find, calculate and execute trades */
class Trader {
  constructor(minTrade, trigger) {
    this.minTrade = minTrade;
    this.trigger = trigger;
  }

  canTrade(market1, market2, wallet) {
    const meetsMin =
      wallet[market1.market][market1.asset] * market1.bid > this.minTrade &&
      wallet[market2.market][market2.currency] - 0.003 > this.minTrade;

    return meetsMin;
  }

  truncateAmount(num = 0, decimals = 0) {
    if (!num || typeof num !== 'number') {
      return 0;
    }

    if (
      num
        .toString()
        .split('.')
        .pop().length < decimals ||
      num.toString().indexOf('.') < 0 ||
      decimals <= 0
    ) {
      return num;
    }

    const getTruncated = new RegExp('^-?\\d+(?:\\.\\d{0,' + decimals + '})?');
    return parseFloat(
      num
        .toString()
        .match(getTruncated)
        .shift()
    );
  }

  executeTrade(
    trade,
    wallets,
    sellExchange,
    buyExchange,
    logAndFindAnotherTrade
  ) {
    // find limiting asset/currency
    const limits = this.getLimits(trade, wallets);

    if (limits.startAsset && limits.startCurrency) {
      const m1Precision =
        PRECISIONS[trade.market1.asset + '-' + trade.market1.currency][
          trade.market1.market
        ];
      const m2Precision =
        PRECISIONS[trade.market1.asset + '-' + trade.market1.currency][
          trade.market2.market
        ];

      trade.data = {
        asset: limits.startAsset,
        currency: limits.startCurrency,
        gain:
          limits.startAsset *
            trade.market1.bid *
            (1 - trade.market1.fees.taker) -
          limits.startCurrency
      };

      axios
        .all([
          sellExchange.sellOrder(
            trade.market1,
            trade.market1.bid * 0.9,
            this.truncateAmount(trade.data.asset, m1Precision),
            0
          ),
          buyExchange.buyOrder(
            trade.market2,
            trade.market2.ask * 1.1,
            this.truncateAmount(
              trade.data.currency / trade.market2.ask,
              m2Precision
            ),
            0
          )
        ])
        .then(
          axios.spread((sellOrder, buyOrder) => {
            // order status is pending at this point need to constantly check if they are both done
            this.checkOrders(
              sellExchange,
              buyExchange,
              trade,
              logAndFindAnotherTrade
            );
          })
        )
        .catch(err => {
          console.log(err, trade);
        });
    } else {
      trade.data = {
        asset: 0,
        currency: 0,
        gain: 0
      };
      logAndFindAnotherTrade(trade, false);
    }
  }

  executePaperTrade(trade, wallets) {
    // find limiting asset/currency
    const limits = this.getLimits(trade, wallets);
    // will hold the new wallet values post trade
    let paperWallet = Object.assign({}, wallets);
    // send trades/update paper wallet
    if (limits.startAsset && limits.startCurrency) {
      paperWallet[trade.market1.market][trade.market1.asset] -=
        limits.startAsset;
      paperWallet[trade.market1.market][trade.market1.currency] +=
        limits.startAsset * trade.market1.bid * (1 - trade.market1.fees.taker);

      paperWallet[trade.market2.market][trade.market2.currency] -=
        limits.startCurrency;
      paperWallet[trade.market2.market][trade.market2.asset] +=
        limits.startCurrency /
        trade.market2.ask *
        (1 - trade.market2.fees.taker);
    }
    // return the updated wallet after the trade is complete
    return {
      paperWallet,
      data: {
        asset: limits.startAsset,
        currency: limits.startCurrency,
        gain:
          limits.startAsset *
            trade.market1.bid *
            (1 - trade.market1.fees.taker) -
          limits.startCurrency
      }
    };
  }

  getLimits(trade, wallets) {
    // market precisions
    const m1Precision =
      PRECISIONS[trade.market1.asset + '-' + trade.market1.currency][
        trade.market1.market
      ];
    const m2Precision =
      PRECISIONS[trade.market1.asset + '-' + trade.market1.currency][
        trade.market2.market
      ];

    // amounts to trade with based on wallet
    let startAsset = wallets[trade.market1.market][trade.market1.asset];
    if (startAsset > trade.market1.bidQty) {
      startAsset = trade.market1.bidQty;
    }
    let startCurrency = wallets[trade.market2.market][trade.market2.currency];
    if (startCurrency > trade.market2.askQty * trade.market2.ask) {
      startCurrency = trade.market2.askQty * trade.market2.ask;
    }

    const meetsMin =
      startAsset * trade.market1.bid > this.minTrade &&
      startCurrency > this.minTrade;

    if (!meetsMin) {
      return {};
    }

    /* if the theoretical output of the market2 trade using the total amount of currency in market2's wallet is greater than the amount of asset in       market1's wallet, then work backwards from the amount of asset in market1's wallet to find the amount of currency to transact in market2
       otherwise, set the amount of asset to sell on market1 = to the theoretical output with the full amount of currency in market2's wallet */
    const assetLimiting =
      startCurrency / trade.market2.ask * (1 - trade.market2.fees.taker) >
      startAsset;

    // set amounts to trade with
    if (assetLimiting) {
      startCurrency =
        startAsset * trade.market2.ask / (1 - trade.market2.fees.taker);
      if (m1Precision < m2Precision) {
        // selling assset on binance so we limit the asset sale to the amount we're allowed to sell
        startAsset = this.truncateAmount(startAsset, m1Precision);
        // startCurrency now uses the truncated startAsset as its target net output for the transaction
        startCurrency =
          startAsset * trade.market2.ask / (1 - trade.market2.fees.taker);
      } else if (m2Precision < m1Precision) {
        // buying asset on binance but the amount of asset on market1 is the limiting factor.
        startAsset =
          this.truncateAmount(startCurrency / trade.market2.ask, m2Precision) *
          (1 - trade.market2.fees.taker);
        startCurrency =
          this.truncateAmount(startCurrency / trade.market2.ask, m2Precision) *
          trade.market2.ask;
      }
    } else {
      startAsset =
        startCurrency / trade.market2.ask * (1 - trade.market2.fees.taker);
      if (m1Precision < m2Precision) {
        // since currency is limiting amount, we'll want to figure out the most asset we can buy with all our currency in market2, truncate it (which will be = startAsset), and then work backwards to find the amount of currency to spend in market2
        startAsset = this.truncateAmount(startAsset, m1Precision);
        startCurrency =
          startAsset / (1 - trade.market2.fees.taker) * trade.market2.ask;
      } else if (m2Precision < m1Precision) {
        // since our limiting factor is currency and we're spending that in binance as market2, we need to find the most we can transact, truncate that number to the binance specification, and then work backward to the amount of currency to spend to get that truncated amount of asset on market2 (before fees)
        startCurrency =
          this.truncateAmount(startCurrency / trade.market2.ask, m2Precision) *
          trade.market2.ask;
        // then set startAsset to the actual output of the market2 transaction
        startAsset =
          startCurrency / trade.market2.ask * (1 - trade.market2.fees.taker);
      }
    }

    return {
      startAsset,
      startCurrency
    };
  }

  getMargin(market1, market2, wallet) {
    // theoretical 1 BTC currency input but it doesnt matter.
    // market 1 - asset to currency
    // market 2 - currency to asset
    if (!this.canTrade(market1, market2, wallet)) {
      return 0;
    }
    return (
      (1 /
        market2.ask *
        (1 - market2.fees.taker) *
        market1.bid *
        (1 - market1.fees.taker) -
        1) /
      1
    );
  }

  // compares all coins market prices. if margin meets trigger. return trade
  getTrade(coins, wallet) {
    // trade to return
    let trade;

    // compares current highest trade and a new one
    const updateTrade = (current, newest) => {
      // keep current if theres a trade and its higher than the new
      if (current.net && current.net > newest.net) {
        return current;
      }

      return newest;
    };

    // for each coin and its available market pairs
    for (coin in coins) {
      // all the markets for that coin
      let markets = coins[coin];
      // only check if there's at least two markets to compare
      while (markets.length > 1) {
        // current market
        const m = markets.pop();
        // compare with all remaining markets
        for (let k = 0; k < markets.length; k++) {
          const market1 = m;
          const market2 = markets[k];
          // add in the fees
          market1.fees = FEES[market1.market];
          market2.fees = FEES[market2.market];
          // calc nets
          const m1ToM2 = this.getMargin(market1, market2, wallet);
          const m2ToM1 = this.getMargin(market2, market1, wallet);
          // see if either pair beats the current trades net
          // TODO: if exchange 1 and exchange 2 wallets have x amounts for asset and currency
          if (m1ToM2 > m2ToM1) {
            trade = updateTrade(trade, {
              market1,
              market2,
              net: m1ToM2
            });
          } else {
            trade = updateTrade(trade, {
              market1: market2,
              market2: market1,
              net: m2ToM1
            });
          }
        }
      }
    }

    // if there's a trade and the net is not greater than our min allowed for a trade then return nothing
    if (trade.net < this.trigger) {
      return false;
    }

    // return the trade and all info needed to exec on any exchange
    return trade;
  }

  checkOrders(exchange1, exchange2, trade, callback) {
    const areOrdersComplete = (exchange1, exchange2, pair) => {
      return axios
        .all([exchange1.getOrderStatus(pair), exchange2.getOrderStatus(pair)])
        .then(
          axios.spread((sellOrder, buyOrder) => {
            if (buyOrder.length || sellOrder.length) {
              return false;
            }

            return true;
          })
        )
        .catch(err => console.log(err));
    };

    areOrdersComplete(exchange1, exchange2, trade.market1)
      .then(res => {
        if (res) {
          // log and go again
          callback(trade);
        } else {
          this.checkOrders(exchange1, exchange2, trade, callback);
        }
      })
      .catch(err => console.log(err));
  }
}

module.exports = Trader;
