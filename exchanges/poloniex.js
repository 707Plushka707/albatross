const axios = require("axios");
const Poloniex = require("poloniex-api-node");
const keys = require("./keys").poloniex;
const poloniex = new Poloniex(keys.privateKey, keys.secret);

const pairs = require("./pairs")
  .getExchangePairs("poloniex")
  .map(name =>
    name
      .split("-")
      .reverse()
      .join("_")
  );

const mapTicker = (name, bid, bidQty, ask, askQty, market, asset, currency) => {
  return {
    name,
    bid,
    bidQty,
    ask,
    askQty,
    market,
    asset,
    currency
  };
};

poloniex.fees = {
  maker: 0.0015,
  taker: 0.0025
};

poloniex.getTicker = () =>
  axios
    .all([poloniex.returnTicker(), poloniex.returnOrderBook("all", null)])
    .then(response => {
      const fullTicker = response[0];
      const orders = response[1];
      const ticker = [];

      for (coin in fullTicker) {
        if (pairs.indexOf(coin) >= 0) {
          fullTicker[coin].name = coin
            .split("_")
            .reverse()
            .join("");
          fullTicker[coin].asset = coin.split("_").pop();
          fullTicker[coin].currency = coin.split("_").shift();
          fullTicker[coin].askQty = orders[coin].asks[0][1];
          fullTicker[coin].bidQty = orders[coin].bids[0][1];
          ticker.push(fullTicker[coin]);
        }
      }

      return ticker.map(item =>
        mapTicker(
          item.name,
          item.highestBid,
          item.askQty,
          item.lowestAsk,
          item.bidQty,
          "poloniex",
          item.asset,
          item.currency
        )
      );
    })
    .catch(error => {
      return [];
    });

poloniex.getWallet = () =>
  axios
    .all([poloniex.returnBalances()])
    .then(response => {
      const allBalances = response[0];
      const wallet = {};

      for (let i = 0; i < pairs.length; i++) {
        const asset = pairs[i].split("_")[1];
        wallet[asset] = parseFloat(allBalances[asset]);
      }

      return wallet;
    })
    .catch(error => {
      console.log(error);
      return {};
    });

/*
    Trading
    Params
    pair: coin pair object. for this exchange its in the format CUR_ASSET ex: BTC_ETH
    rate: the price
    amount: the amount to buy or sell
    fillOrKill: either fills order immediately in full or aborts. Set to 1 to activate
*/
poloniex.buyOrder = (pair, rate, amount, fillOrKill = 0) =>
  poloniex.buy(pair.currency + "_" + pair.asset, rate, amount, fillOrKill);

poloniex.sellOrder = (pair, rate, amount, fillOrKill = 0) =>
  poloniex.sell(pair.currency + "_" + pair.asset, rate, amount, fillOrKill);

poloniex.checkOrder = pair =>
  poloniex.returnOpenOrders(pair.currency + "_" + pair.asset);

module.exports = poloniex;
