const trader = {
  execute: function(trade, paperWallet) {
    // find limiting asset/currency
    const limits = this.getLimits(trade, paperWallet);
    // will hold the new wallet values post trade
    let newWallet = paperWallet;

    // send trades/update paper wallet
    if(limits.startAsset && limits.startCurrency) {
      newWallet[trade.market1.market][trade.market1.asset] -= limits.startAsset;
      newWallet[trade.market1.market][trade.market1.currency] += limits.startAsset * trade.market1.bid * (1 - trade.market1.fees.taker);

      newWallet[trade.market2.market][trade.market2.currency] -= limits.startCurrency;
      newWallet[trade.market2.market][trade.market2.asset] += startCurrency / trade.market2.ask * (1 - trade.market2.fees.taker);
    }

    // return the updated wallet after the trade is complete
    return newWallet;
  },
  getLimits: function(trade, paperWallet) {
    /* if the theoretical output of the market2 trade using the total amount of currency in market2's wallet is greater than the amount of asset in       market1's wallet, then work backwards from the amount of asset in market1's wallet to find the amount of currency to transact in market2        
       otherwise, set the amount of asset to sell on market1 = to the theoretical output with the full amount of currency in market2's wallet */
    const useCurrency = paperWallet[trade.market2.market][trade.market2.currency] / trade.market2.ask * (1 - trade.market2.fees.taker) > paperWallet[trade.market1.market][trade.market1.asset];

    // amounts to trade with based on wallet
    let startAsset = startCurrency = 0;

    // set amounts to trade with
    if (useCurrency) {
      startAsset = paperWallet[trade.market1.market][trade.market1.asset];
      startCurrency = paperWallet[trade.market1.market][trade.market1.asset] * trade.market2.ask / (1 - trade.market2.fees.taker);
    }
    else {
      startAsset = paperWallet[trade.market2.market][trade.market2.currency] / trade.market2.ask * (1 - trade.market2.fees.taker);
      startCurrency = paperWallet[trade.market2.market][trade.market2.currency];
    }
    return { startAsset, startCurrency };
   }
};

module.exports = trader;
