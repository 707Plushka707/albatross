// this is meant to replace the if (useCurrency)...else statement in getLimit

// first check makes sure binance is not an exchange being considered and then does the normal calculations
// otherwise, it takes into account the amount of asset we're allowed to buy or sell in calculating the starting asset and currency amounts
if (useCurrency) { // asset is limiting amount

  startAsset = paperWallet[trade.market1.market][trade.market1.asset];
  startCurrency =
    paperWallet[trade.market1.market][trade.market1.asset] *
    trade.market2.ask /
    (1 - trade.market2.fees.taker);

  if (market1.market = "Binance") {
    // selling assset on binance so we limit the asset sale to the amount we're allowed to sell
    startAsset = truncate(paperWallet[trade.market1.market][trade.market1.asset], limitDigits[trade.market1.market][trade.market1.asset]);
    // startCurrency now uses the truncated startAsset as its target net output for the transaction
    startCurrency = startAsset * trade.market2.ask / (1 - trade.market2.fees.taker);
  }
  if (market2.market = "Binance") {
    // buying asset on binance but the amount of asset on market1 is the limiting factor.
    // 1 - we'll calculate the max asset we can sell on market1 and the resulting currency needed
    // 2 - we'll use that amount of currency to find the maximum amount of asset on binance we can buy given the limiting limiting digits
    tempStartCurrency = paperWallet[trade.market1.market][trade.market1.asset] * trade.market2.ask / (1 - trade.market2.fees.taker);
    // 3 - then we'll calculate backward to find the amount of BTC needed to transact that truncated amount
    startCurrency = truncate(tempStartCurrency / trade.market2.ask, limitDigits[trade.market2.market][trade.market2.asset]) * trade.market2.ask
    // 4 - we'll calculate back to the starting amount of asset to sell on the non-Binance exchange
    startAsset = truncate(tempStartCurrency / trade.market2.ask, limitDigits[trade.market2.market][trade.market2.asset]) * (1 - trade.market.fees.taker);
  }
} else { // currency is limiting amount
  startAsset =
    paperWallet[trade.market2.market][trade.market2.currency] /
    trade.market2.ask *
    (1 - trade.market2.fees.taker);
  startCurrency = paperWallet[trade.market2.market][trade.market2.currency];

  if (market1.market = "Binance") {
    // since currency is limiting amount, we'll want to figure out the most asset we can buy with all our currency in market2, truncate it (which will be = startAsset), and then work backwards to find the amount of currency to spend in market2
    tempStartCurrency = paperWallet[trade.market2.market][trade.market2.currency];
    startAsset = truncate(tempStartCurrency / trade.market2.ask * (1 - trade.market2.fees.taker), limitDigits[trade.market1.market][trade.market1.asset]);
    startCurrency = startAsset / (1 - trade.market2.fees.taker) * trade.market2.ask;
  }
  if (market2.market = "Binance") {
    // since our limiting factor is currency and we're spending that in Binance as market2, we need to find the most we can transact, truncate that number to the binance specification, and then work backward to the amount of currency to spend to get that truncated amount of asset on market2 (before fees)
    startCurrency = truncate(paperWallet[trade.market2.market][trade.market2.currency] / trade.market2.ask, limitDigits[trade.market2.market][trade.market2.asset]) * tradke.market2.ask;
    // then set startAsset to the actual output of the market2 transaction
    startAsset = startCurrency /
      trade.market2.ask *
      (1 - trade.market2.fees.taker);
  }
}