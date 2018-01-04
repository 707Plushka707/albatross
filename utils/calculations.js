const FEES = require('./../exchanges/exchanges').fees;

const calculations = {
  getMargin: function(market1, market2, coin) {
    return console.log('checking margin for ', coin, 'on ', market1.market, ' to ', market2.market);
    // trading fees - need to confirm values for each ex
    // K I KNOW THIS IS PROBABLY THE WRONG WAY TO CALL THESE VALUES BUT I THINK YOU GET WHAT I'm GETTING AT
    
    // curr = 1 // theoretical 1 BTC currency input but it doesnt matter.
    // we could just hardcode '1' where 'curr' because regardless of the value of curr it will return the same %
    // return ( ( curr / market2[coin].ask * ( 1 - market2.fee ) * market1[coin].bid * ( 1 - market1.fee ) ) - curr ) / curr
    
    // coin1 -> coin2 trade
    // const c1Toc2 = wallet[ltc] * price[market 1 ask or bid?] - (fees[taker of market 1?] * wallet[ltc] * price[arket 1 ask or bid?]);
    
    // polo coin2 -> coin1 trade
    // const c2Toc1 = c1Toc2 / price[market 2 ask or bid?] - (fees[taker of market 2?] * c1Toc2 / price[market 2 ask or bid?]);
    
    // coin gained or lost
    // const diff = c2Toc1 - gdaxAcc[coin1];

    // return diff;
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
          // temp for checking nulls. will fix when getMargin updates
          if(this.canTrade(coin, wallets[market1.market]) && this.canTrade(coin, wallets[market2.market])) {
            // add in the fees
            market1.fees = FEES[market1.market];
            market2.fees = FEES[market2.market];
            this.getMargin(market1, market2, coin);
            this.getMargin(market2, market1, coin);
            // TODO: THese two get margin trades. need to know which si which so can edit can trade logic
            // TODO: Run Calculations here for each market pair
            // TODO: If Calculations meet trigger - fire the trade
          }
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
