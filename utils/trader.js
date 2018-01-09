trade execution

executeTrade (trade, market, paperWallet) {
 // find limiting asset/currency (getInputs(t))
 trade = getInputs(trade, market, paperWallet); //i have no idea how this works but i want this to return the currency & asset input amounts
 // send trades/update paper wallet
  // when we get to the point of executing trades, i assume we will just send tradeAPI(exchange1, exchange2, coin, assetInput, currencyInput)
  // once that is done, we'll wait for trade confirmation and then update wallets through API

  //paper wallet update should be sent trade (including startCurrency & startAsset) and market (for bid/ask) and "perform the trade" by subtracting the inputs and adding back the outputs to the wallet.
}


getInputs (trade, market, paperWallet)
  if (paperWallet[trade.market2.market][trade.market1.currency]/market[trade.market2].ask*(1-market2.fees.taker) > paperWallet[trade.market1.market][trade.market1.asset])
  // if the theoretical output of the market2 trade using the total amount of currency in market2's wallet is greater than the amount of asset in market1's wallet, then work backwards from the amount of asset in market1's wallet to find the amount of currency to transact in market2 (HOLY SHIT THAT'S LONG)
  {
    trade.market2.startCurrency = paperWallet[trade.market1.market][trade.market1.asset]*market[trade.market2].ask/(1-market2.fees.taker);
    trade.market1.startAsset = paperWallet[trade.market2.market][trade.market1.currency];
  }
  // otherwise, set the amount of asset to sell on market1 = to the theoretical output with the full amount of currency in market2's wallet
  else {
    trade.market1.startAsset = paperWallet[trade.market2.market][trade.market1.currency]/market[trade.market2].ask*(1-market2.fees.taker);
    trade.market2.startCurrency = paperWallet[trade.market1.market][trade.market1.asset];
  }
  return trade; // send the trade back to the execute trade function w/ the startCurrency and startAsset amounts.  see above comment about "idk what i'm doing"
}
