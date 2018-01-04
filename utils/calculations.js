const FEES = require('./../exchanges/exchanges').fees;

const calculations = {
  getMargin: function(market1, market2, coin) {
    // theoretical 1 BTC currency input but it doesnt matter.
    const curr = 1;
    return ((curr / market2.ask * (1 - market2.fees.taker) * market1.bid * (1 - market1.fees.taker)) - curr) / curr;
  },
  // compares all coins market prices. if margin meets trigger. fire trade
  compare: function(coins, trigger, wallets) {
    for(coin in coins) {
      // all the markets for that coin
      let markets = coins[coin];
      // only check if there's at least two markets to compare
      while(markets.length > 1) {
        const m = markets.pop();
        for(let k = 0; k < markets.length; k++) {
          const market1 = m;
          const market2 = markets[k];
          // add in the fees
          market1.fees = FEES[market1.market];
          market2.fees = FEES[market2.market];
          // TODO: dont even run these funcs if you dont have the coin in the wallets
          console.log(this.getMargin(market1, market2, coin), coin, 'margin for', market1.market, 'to', market2.market);
          console.log(this.getMargin(market2, market1, coin), coin, 'margin for', market2.market, 'to', market1.market);
          // TODO: Run Calculations here for each market pair
          // TODO: If Calculations meet trigger - fire the trade
        }
      }
    }
  },
  canTrade: function(pair, wallet) {
    let canTrade = true;
    
    for (entry in wallet) {
      if (pair.indexOf(entry)) {
        if (wallet[entry] === 0) {
          canTrade = false;
          break;
        }
      }
    }

    return canTrade;
  }
};

module.exports = calculations;
