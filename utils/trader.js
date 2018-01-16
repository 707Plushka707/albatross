const FEES = require('./../exchanges/exchanges').fees;

class Trader {
  canTrade(market1, market2, paperWallet) {
    const MIN_TRADE = 0.0003;
    const meetsMin =
      paperWallet[market1.market][market1.asset] * market1.bid > MIN_TRADE &&
      paperWallet[market2.market][market2.currency] > MIN_TRADE;

    return meetsMin;
  }

  executeTrade(trade, paperWallet) {
    // find limiting asset/currency
    const limits = this.getLimits(trade, paperWallet);
    // will hold the new wallet values post trade
    let newWallet = paperWallet;

    // send trades/update paper wallet
    if (limits.startAsset && limits.startCurrency) {
      newWallet[trade.market1.market][trade.market1.asset] -= limits.startAsset;
      newWallet[trade.market1.market][trade.market1.currency] +=
        limits.startAsset * trade.market1.bid * (1 - trade.market1.fees.taker);

      newWallet[trade.market2.market][trade.market2.currency] -=
        limits.startCurrency;
      newWallet[trade.market2.market][trade.market2.asset] +=
        limits.startCurrency /
        trade.market2.ask *
        (1 - trade.market2.fees.taker);
    }

    // return the updated wallet after the trade is complete
    return {
      newWallet,
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

  getLimits(trade, paperWallet) {
    /* if the theoretical output of the market2 trade using the total amount of currency in market2's wallet is greater than the amount of asset in       market1's wallet, then work backwards from the amount of asset in market1's wallet to find the amount of currency to transact in market2
       otherwise, set the amount of asset to sell on market1 = to the theoretical output with the full amount of currency in market2's wallet */
    const useCurrency =
      paperWallet[trade.market2.market][trade.market2.currency] /
        trade.market2.ask *
        (1 - trade.market2.fees.taker) >
      paperWallet[trade.market1.market][trade.market1.asset];

    // amounts to trade with based on wallet
    let startAsset = 0;
    let startCurrency = 0;

    // set amounts to trade with
    if (useCurrency) {
      startAsset = paperWallet[trade.market1.market][trade.market1.asset];
      startCurrency =
        paperWallet[trade.market1.market][trade.market1.asset] *
        trade.market2.ask /
        (1 - trade.market2.fees.taker);
    } else {
      startAsset =
        paperWallet[trade.market2.market][trade.market2.currency] /
        trade.market2.ask *
        (1 - trade.market2.fees.taker);
      startCurrency = paperWallet[trade.market2.market][trade.market2.currency];
    }
    return { startAsset, startCurrency };
  }

  getMargin(market1, market2, paperWallet) {
    // theoretical 1 BTC currency input but it doesnt matter.
    // market 1 - asset to currency
    // market 2 - currency to asset
    if (!this.canTrade(market1, market2, paperWallet)) {
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
  getTrade(coins, paperWallet) {
    // constants
    const TRIGGER = 0.005;
    // trade to return
    let trade = {};

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
          const m1ToM2 = this.getMargin(market1, market2, paperWallet);
          const m2ToM1 = this.getMargin(market2, market1, paperWallet);
          // see if either pair beats the current trades net
          // TODO: if exchange 1 and exchange 2 wallets have x amounts for asset and currency
          if (m1ToM2 > m2ToM1) {
            trade = updateTrade(trade, { market1, market2, net: m1ToM2 });
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
    if (trade.net < TRIGGER || !trade.net) {
      return false;
    }

    // return the trade and all info needed to exec on any exchange
    return trade;
  }
}

module.exports = Trader;
