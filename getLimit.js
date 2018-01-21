// this is meant to replace the if (useCurrency)...else statement in getLimit
if (useCurrency) {
  // asset is limiting amount
  startAsset = paperWallet[trade.market1.market][trade.market1.asset];
  startCurrency =
    startAsset *
    trade.market2.ask /
    (1 - trade.market2.fees.taker);

  if (market1.market = 'binance') {
    // selling assset on binance so we limit the asset sale to the amount we're allowed to sell
    startAsset = truncate(startAsset, limitDigits[trade.market1.market][trade.market1.asset]);
    // startCurrency now uses the truncated startAsset as its target net output for the transaction
    startCurrency = startAsset * trade.market2.ask / (1 - trade.market2.fees.taker);
  } else if (market2.market = 'binance') {
    // buying asset on binance but the amount of asset on market1 is the limiting factor.
    startAsset = truncate(startCurrency / trade.market2.ask, limitDigits[trade.market2.market][trade.market2.asset]) * (1 - trade.market.fees.taker);
    startCurrency = truncate(startCurrency / trade.market2.ask, limitDigits[trade.market2.market][trade.market2.asset]) * trade.market2.ask;
  }
} else {
  // currency is limiting amount
  startCurrency = paperWallet[trade.market2.market][trade.market2.currency];
  startAsset =
    startCurrency /
    trade.market2.ask *
    (1 - trade.market2.fees.taker);

  if (market1.market = 'binance') {
    // since currency is limiting amount, we'll want to figure out the most asset we can buy with all our currency in market2, truncate it (which will be = startAsset), and then work backwards to find the amount of currency to spend in market2
    startAsset = truncate(startAsset, limitDigits[trade.market1.market][trade.market1.asset]);
    startCurrency = startAsset / (1 - trade.market2.fees.taker) * trade.market2.ask;
  } else if (market2.market = 'binance') {
    // since our limiting factor is currency and we're spending that in binance as market2, we need to find the most we can transact, truncate that number to the binance specification, and then work backward to the amount of currency to spend to get that truncated amount of asset on market2 (before fees)
    startCurrency = truncate(startCurrency / trade.market2.ask, limitDigits[trade.market2.market][trade.market2.asset]) * trade.market2.ask;
    // then set startAsset to the actual output of the market2 transaction
    startAsset = startCurrency /
      trade.market2.ask *
      (1 - trade.market2.fees.taker);
  }
}