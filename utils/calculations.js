const Exchanges = require('./../exchanges/exchanges');

const calculations = {
  margin: function(market1, market2, coin) {
    console.log('checking', coin,  market1, market2);
    // trading fees - need to confirm values for each ex

    // coin1 -> coin2 trade
    // const c1Toc2 = wallet[ltc] * price[market 1 ask or bid?] - (fees[taker of market 1?] * wallet[ltc] * price[arket 1 ask or bid?]);
    
    // polo coin2 -> coin1 trade
    // const c2Toc1 = c1Toc2 / price[market 2 ask or bid?] - (fees[taker of market 2?] * c1Toc2 / price[market 2 ask or bid?]);
    
    // coin gained or lost
    // const diff = c2Toc1 - gdaxAcc[coin1];

    // return diff;
  },
  // compares all coins market prices. if margin meets trigger. fire trade
  compare: function(coins) {
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
          market1.fees = Exchanges[market1.market].fees;
          market2.fees = Exchanges[market2.market].fees;
          console.log(this.margin(market1, market2, coin));
          console.log(this.margin(market2, market1, coin));
          // TODO: Run Calculations here for each market pair
          // TODO: If Calculations meet trigger - fire the trade
        }
      }
    }
  }
};

module.exports = calculations;