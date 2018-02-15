const config = [{
    name: 'ETH-BTC',
    active: true,
    tradedOn: ['binance', 'bittrex', 'gdax', 'poloniex'],
    precision: {
      binance: 3,
      bittrex: 8,
      gdax: 8,
      poloniex: 8
    }
  },
  {
    name: 'LTC-BTC',
    active: true,
    tradedOn: ['binance', 'bittrex', 'gdax', 'poloniex'],
    precision: {
      binance: 2,
      bittrex: 8,
      gdax: 8,
      poloniex: 8
    }
  },
  {
    name: 'LTC-ETH',
    active: true,
    tradedOn: ['binance', 'bittrex'],
    precision: {
      binance: 3,
      bittrex: 8,
      gdax: 8,
      poloniex: 8
    }
  },
  {
    name: 'DASH-BTC',
    active: true,
    tradedOn: ['binance', 'bittrex', 'poloniex'],
    precision: {
      binance: 3,
      bittrex: 8,
      gdax: 8,
      poloniex: 8
    }
  },
  {
    name: 'DASH-ETH',
    active: true,
    tradedOn: ['binance', 'bittrex'],
    precision: {
      binance: 3,
      bittrex: 8,
      gdax: 8,
      poloniex: 8
    }
  },
  {
    name: 'ETC-BTC',
    active: true,
    tradedOn: ['binance', 'bittrex', 'poloniex'],
    precision: {
      binance: 2,
      bittrex: 8,
      gdax: 8,
      poloniex: 8
    }
  },
  {
    name: 'ETC-ETH',
    active: true,
    tradedOn: ['binance', 'bittrex', 'poloniex'],
    precision: {
      binance: 2,
      bittrex: 8,
      gdax: 8,
      poloniex: 8
    }
  },
  {
    name: 'LSK-BTC',
    active: true,
    tradedOn: ['binance', 'bittrex', 'poloniex'],
    precision: {
      binance: 2,
      bittrex: 8,
      gdax: 8,
      poloniex: 8
    }
  },
  {
    name: 'LSK-ETH',
    active: true,
    tradedOn: ['binance', 'poloniex'],
    precision: {
      binance: 2,
      bittrex: 8,
      gdax: 8,
      poloniex: 8
    }
  },
  {
    name: 'NAV-BTC',
    active: true,
    tradedOn: ['binance', 'bittrex', 'poloniex'],
    precision: {
      binance: 0,
      bittrex: 8,
      gdax: 8,
      poloniex: 8
    }
  },
  {
    name: 'OMG-BTC',
    active: true,
    tradedOn: ['binance', 'bittrex', 'poloniex'],
    precision: {
      binance: 2,
      bittrex: 8,
      gdax: 8,
      poloniex: 8
    }
  },
  {
    name: 'OMG-ETH',
    active: true,
    tradedOn: ['binance', 'bittrex', 'poloniex'],
    precision: {
      binance: 2,
      bittrex: 8,
      gdax: 8,
      poloniex: 8
    }
  },
  {
    name: 'STORJ-BTC',
    active: true,
    tradedOn: ['binance', 'bittrex', 'poloniex'],
    precision: {
      binance: 0,
      bittrex: 8,
      gdax: 8,
      poloniex: 8
    }
  },
  {
    name: 'STORJ-ETH',
    active: true,
    tradedOn: ['binance', 'bittrex'],
    precision: {
      binance: 0,
      bittrex: 8,
      gdax: 8,
      poloniex: 8
    }
  },
  {
    name: 'STRAT-BTC',
    active: true,
    tradedOn: ['binance', 'bittrex', 'poloniex'],
    precision: {
      binance: 2,
      bittrex: 8,
      gdax: 8,
      poloniex: 8
    }
  },
  {
    name: 'STRAT-ETH',
    active: true,
    tradedOn: ['binance', 'bittrex'],
    precision: {
      binance: 2,
      bittrex: 8,
      gdax: 8,
      poloniex: 8
    }
  },
  {
    name: 'XMR-BTC',
    active: true,
    tradedOn: ['binance', 'bittrex', 'poloniex'],
    precision: {
      binance: 3,
      bittrex: 8,
      gdax: 8,
      poloniex: 8
    }
  },
  {
    name: 'XMR-ETH',
    active: true,
    tradedOn: ['binance', 'bittrex'],
    precision: {
      binance: 0,
      bittrex: 8,
      gdax: 8,
      poloniex: 8
    }
  },
  {
    name: 'XRP-BTC',
    active: true,
    tradedOn: ['binance', 'bittrex', 'poloniex'],
    precision: {
      binance: 0,
      bittrex: 8,
      gdax: 8,
      poloniex: 8
    }
  },
  {
    name: 'XRP-ETH',
    active: true,
    tradedOn: ['binance', 'bittrex'],
    precision: {
      binance: 0,
      bittrex: 8,
      gdax: 8,
      poloniex: 8
    }
  },
  {
    name: 'ZEC-BTC',
    active: true,
    tradedOn: ['binance', 'bittrex', 'poloniex'],
    precision: {
      binance: 3,
      bittrex: 8,
      gdax: 8,
      poloniex: 8
    }
  },
  {
    name: 'ZEC-ETH',
    active: true,
    tradedOn: ['binance', 'bittrex', 'poloniex'],
    precision: {
      binance: 3,
      bittrex: 8,
      gdax: 8,
      poloniex: 8
    }
  },
  {
    name: 'BTS-BTC',
    active: true,
    tradedOn: ['binance', 'poloniex'],
    precision: {
      binance: 0,
      bittrex: 8,
      gdax: 8,
      poloniex: 8
    }
  },
  {
    name: 'ZRX-ETH',
    active: true,
    tradedOn: ['binance', 'poloniex'],
    precision: {
      binance: 0,
      bittrex: 8,
      gdax: 8,
      poloniex: 8
    }
  },
  {
    name: 'ZRX-BTC',
    active: true,
    tradedOn: ['binance', 'poloniex'],
    precision: {
      binance: 0,
      bittrex: 8,
      gdax: 8,
      poloniex: 8
    }
  },
  {
    name: 'GAS-BTC',
    active: true,
    tradedOn: ['binance', 'poloniex'],
    precision: {
      binance: 2,
      bittrex: 8,
      gdax: 8,
      poloniex: 8
    }
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