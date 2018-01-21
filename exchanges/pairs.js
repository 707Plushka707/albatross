const config = [{
    name: 'ETH-BTC',
    active: true,
    tradedOn: ['binance', 'bittrex', 'gdax', 'poloniex'],
    precision: {
      binance: 1,
      bittrex: 10,
      gdax: 20,
      poloniex: 13
    }
  },
  {
    name: 'LTC-BTC',
    active: true,
    tradedOn: ['binance', 'bittrex', 'gdax', 'poloniex']
  },
  {
    name: 'LTC-ETH',
    active: true,
    tradedOn: ['binance', 'bittrex']
  },
  {
    name: 'DASH-BTC',
    active: true,
    tradedOn: ['binance', 'bittrex', 'poloniex']
  },
  {
    name: 'DASH-ETH',
    active: true,
    tradedOn: ['binance', 'bittrex']
  },
  {
    name: 'ETC-BTC',
    active: true,
    tradedOn: ['binance', 'bittrex', 'poloniex']
  },
  {
    name: 'ETC-ETH',
    active: true,
    tradedOn: ['binance', 'bittrex', 'poloniex']
  },
  {
    name: 'LSK-BTC',
    active: true,
    tradedOn: ['binance', 'bittrex', 'poloniex']
  },
  {
    name: 'LSK-ETH',
    active: true,
    tradedOn: ['binance', 'poloniex']
  },
  {
    name: 'NAV-BTC',
    active: true,
    tradedOn: ['binance', 'bittrex', 'poloniex']
  },
  {
    name: 'OMG-BTC',
    active: true,
    tradedOn: ['binance', 'bittrex', 'poloniex']
  },
  {
    name: 'OMG-ETH',
    active: true,
    tradedOn: ['binance', 'bittrex', 'poloniex']
  },
  {
    name: 'STORJ-BTC',
    active: true,
    tradedOn: ['binance', 'bittrex', 'poloniex']
  },
  {
    name: 'STORJ-ETH',
    active: true,
    tradedOn: ['binance', 'bittrex']
  },
  {
    name: 'STRAT-BTC',
    active: true,
    tradedOn: ['binance', 'bittrex', 'poloniex']
  },
  {
    name: 'STRAT-ETH',
    active: true,
    tradedOn: ['binance', 'bittrex']
  },
  {
    name: 'XMR-BTC',
    active: true,
    tradedOn: ['binance', 'bittrex', 'poloniex']
  },
  {
    name: 'XMR-ETH',
    active: true,
    tradedOn: ['binance', 'bittrex']
  },
  {
    name: 'XRP-BTC',
    active: true,
    tradedOn: ['binance', 'bittrex', 'poloniex']
  },
  {
    name: 'XRP-ETH',
    active: true,
    tradedOn: ['binance', 'bittrex']
  },
  {
    name: 'ZEC-BTC',
    active: true,
    tradedOn: ['binance', 'bittrex', 'poloniex']
  },
  {
    name: 'ZEC-ETH',
    active: true,
    tradedOn: ['binance', 'bittrex', 'poloniex']
  }
];

class Pairs {
  constructor(coins) {
    this.pairs = coins;
  }

  // give a market name and return active pairs traded on that market. only need the name returned
  getExchangePairs(market) {
    return this.pairs
      .filter(p => p.active && p.tradedOn.indexOf(market) >= 0)
      .map(c => c.name);
  }
}

const pairs = new Pairs(config);

module.exports = pairs;