const calculations = {
  margin: (market1, market2, coin) => {
    console.log('checking', coin,  market1, market2);
    // trading fees - need to confirm values for each ex
    // const fees = 0.0025;

    // gdax coin1 -> coin2 trade
    // const c1Toc2 = gdaxAcc[coin1] * gdaxPrice - (fees * gdaxAcc[coin1] * gdaxPrice);
    
    // polo coin2 -> coin1 trade
    // const c2Toc1 = c1Toc2 / poloniexPrice - (fees * c1Toc2 / poloniexPrice);
    
    // coin gained or lost
    // const diff = c2Toc1 - gdaxAcc[coin1];

    // return diff;
  }
};

module.exports = calculations;