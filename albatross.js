const axios = require('axios');
// apis for each exchange
const Exchanges = require('./exchanges/exchanges');

// wallets for each exchange
const Wallets = require('./utils/wallets');

// math utilities
const Calc = require('./utils/calculations');

// constants
const TRIGGER = 0.001;
const TIME = 2000;

// for timer
let loop;

const init = () => {
  // get all exchange ticker data
  axios.all([ Exchanges.gdax.getTicker(), Exchanges.poloniex.getTicker(), Exchanges.binance.getTicker()])
  .then(axios.spread((gdax, poloniex, binance) => {
    // coins we're checking
    const coins = {};
    
    /* map the market data by coin to loop through all market comparisons
       if the calls return an empty array that market will just be out of this object */
    [...poloniex, ...binance, ...gdax].forEach((m) => {
      const market = { bid: m.bid, ask: m.ask, market: m.market };
      if(!coins[m.name]) {
        coins[m.name] = [market];
      } else {
        coins[m.name].push(market)
      }
    });

    // compare all possible market pairs for each coin
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
          console.log(Calc.margin(market1, market2, coin));
          console.log(Calc.margin(market2, market1, coin));
          // TODO: Run Calculations here for each market pair
          // TODO: If Calculations meet trigger - fire the trade
        }
      }
    }

    // OLD CODE
    // prices - temp logging
    // const coin1PoloniexPrice = poloniexMrkt[coin2 + '_' + coin1].last;
    // prices['gdax'][coin1 + '_' + coin2] = gdaxMrkt.price;
    // prices['gdax'][coin1 + '_USD'] = coin1USD.price;
    // prices['poloniex'][coin1 + '_' + coin2] = coin1PoloniexPrice;

    // output - calculates net
    // console.log('===================');
    // console.log(prices);
    // console.log('RATIOS: G/P ', gdaxMrkt.price/coin1PoloniexPrice, 'P/G ', coin1PoloniexPrice/gdaxMrkt.price)
    // console.log('NET GAINS: $' + calculateNet(coin1, coin2, gdaxMrkt.price, coin1PoloniexPrice, coin1USD.price));
    // console.log('===================');
  })).catch(error => {
    console.log(error);
  });
};

loop = setInterval(init, TIME);