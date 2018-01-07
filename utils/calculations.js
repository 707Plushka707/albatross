const FEES = require('./../exchanges/exchanges').fees;

const calculations = {
  getMargin: function(market1, market2) {
    // theoretical 1 BTC currency input but it doesnt matter.
    const curr = 1;
    return ((curr / market2.ask * (1 - market2.fees.taker) * market1.bid * (1 - market1.fees.taker)) - curr) / curr;
  },
  // compares all coins market prices. if margin meets trigger. return trade
  getTrade: function(coins, trigger) {
    // trade to return
    let trade = {};

    // compares current highest trade and a new one
    const compareTrades = (current, newest) => {
      // keep current if theres a trade and its higher than the new
      if ((current.net && current.net > newest.net)) {
        return current;
      }

      return newest;
    };
    
    // for each coin and its available market pairs
    for(coin in coins) {
      // all the markets for that coin
      let markets = coins[coin];
      // only check if there's at least two markets to compare
      while(markets.length > 1) {
        // current market
        const m = markets.pop();
        // compare with all remaining markets
        for(let k = 0; k < markets.length; k++) {
          const market1 = m;
          const market2 = markets[k];
          // add in the fees
          market1.fees = FEES[market1.market];
          market2.fees = FEES[market2.market];
          // calc nets
          const m1ToM2 = this.getMargin(market1, market2);
          const m2ToM1 = this.getMargin(market2, market1);
          // see if either pair beats the current trades net
          if(m1ToM2 > m2ToM1) {
            trade = compareTrades(trade, { exchanges: market1.market + '-' + market2.market, net: m1ToM2 });
          } else {
            trade = compareTrades(trade, { exchanges: market1.market + '-' + market2.market, net: m2ToM1 });
          }
        }
      }
    }

    // if there's a trade and the net is not greater than our min allowed for a trade then return nothing
    if (trade.net && trade.net < trigger) {
      return false;
    }

    // return the trade and all info needed to exec on any exchange
    return trade;
  }
};

module.exports = calculations;
