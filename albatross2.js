const axios = require('axios');
const Gdax = require('gdax');
const Poloniex = require('poloniex-api-node');
const Binance = require('binance');
let loop;

// presets
const tradingPairs = ['LTCBTC','ETHBTC'];
const exchange = ['gdax','poloniex','binance'];
const triggerPercentage = .001;
const binanceApiKey = '';
const binanceSecret = '';

// wallets
const gdaxAcc = {
  'BTC': 0,
  'LTC': 6,
  'ETH': 3
};

const poloniexAcc = {
  'BTC': 0.24,
  'LTC': 0,
  'ETH': 0
};


			
// wallets 2.0
const wallets = {
	gdax: {
		'BTC': 0.1,
		'LTC': 3,
		'ETH': 2
	},
	poloniex: {
		'BTC': 0.1,
		'LTC': 3,
		'ETH': 2
	},
	binance: {
		'BTC': 0.1,
		'LTC': 3,
		'ETH': 2}
};

const fees = {
	gdax: {
		maker: 0,
		taker: 0.0025
	},
	poloniex: {
		maker: 0.0015,
		taker: 0.0025
	},
	binance: {
		maker: 0.001,
		taker: 0.001
	}
};

const buyAskTable = {
	gdax: {
		LTCBTC: {},
		ETHBTC: {}
	},
	poloniex: {
		LTCBTC: {},
		ETHBTC: {}
	},
	binance: {
		LTCBTC: {},
		ETHBTC: {}
	}
};
// keeps track of prices for reporting temporarily
const prices = {
  gdax: {},
  poloniex: {}
};

const watchPair = () => {
  // apis
  const poloniexE = new Poloniex();
  const gdaxETH = new Gdax.PublicClient('ETH-BTC');
  const gdaxLTC = new Gdax.PublicClient('LTC-BTC');
  const binanceE = new Binance.BinanceRest({
	key: binanceApiKey,
	secret: binanceSecret
  });

  //const gdaxCoin1USD = new Gdax.PublicClient(coin1 + '-USD');
  //const gdaxCoin1 = new Gdax.PublicClient(coin1 + '-' + coin2);

  // get all the info
  //axios.all([gdaxCoin1.getProductTicker(), poloniex.returnTicker(), gdaxCoin1USD.getProductTicker()])
  //.then(axios.spread((gdaxMrkt, poloniexMrkt, coin1USD) => {
  axios.all([gdaxETH.getProductTicker(), gdaxLTC.getProductTicker(), poloniexE.returnTicker(), binanceE.allBookTickers()])
  .then(axios.spread((gdaxETHMrkt, gdaxLTCMrkt, poloniexMrkt, binanceMrkt) => {
    // exit if market doesnt exist end loop
    if(!poloniexMrkt || !gdaxETHMrkt || !gdaxLTCMrkt || !binanceMrkt) {
      console.log('Invalid coins entered');
      clearInterval(loop);
      return;
    }
    
	// prices - temp logging
    //const coin1PoloniexPrice = poloniexMrkt[coin2 + '_' + coin1].last;
    //prices['gdax'][coin1 + '_' + coin2] = gdaxMrkt.price;
    //prices['gdax'][coin1 + '_USD'] = coin1USD.price;
    //prices['poloniex'][coin1 + '_' + coin2] = coin1PoloniexPrice;
	
	buyAskTable['gdax']['LTCBTC']['ask'] = gdaxLTCMrkt.ask;
	buyAskTable['gdax']['LTCBTC']['bid'] = gdaxLTCMrkt.bid;
	buyAskTable['gdax']['ETHBTC']['ask'] = gdaxETHMrkt.ask;
	buyAskTable['gdax']['ETHBTC']['bid'] = gdaxETHMrkt.bid;

	buyAskTable['poloniex']['LTCBTC']['ask'] = poloniexMrkt['BTC_LTC'].lowestAsk;
	buyAskTable['poloniex']['LTCBTC']['bid'] = poloniexMrkt['BTC_LTC'].highestBid;
	buyAskTable['poloniex']['ETHBTC']['ask'] = poloniexMrkt['BTC_ETH'].lowestAsk;
	buyAskTable['poloniex']['ETHBTC']['bid'] = poloniexMrkt['BTC_ETH'].highestBid;
	
	const binanceETH = binanceMrkt.filter(function (el) {
		return el.symbol == 'ETHBTC';
	});
	const binanceLTC = binanceMrkt.filter(function (el) {
		return el.symbol == 'LTCBTC';
	});

	buyAskTable['binance']['LTCBTC']['ask'] = binanceLTC[0].askPrice;
	buyAskTable['binance']['LTCBTC']['bid'] = binanceLTC[0].bidPrice;
	buyAskTable['binance']['ETHBTC']['ask'] = binanceETH[0].askPrice;
	buyAskTable['binance']['ETHBTC']['bid'] = binanceETH[0].bidPrice;
	
	var topTrade = [];
	var topTrade = [-1];
	console.log(topTrade);
	var tempTrade = [];
	// getMarginBTC(assetExchange,currencyExchange, assetPair, profitCurrency)
	console.log("===================")
	for (const i in exchange) {
		for (const j in exchange) {
			for (const k in tradingPairs) {
				if (i!=j) {
					tempTrade = getMarginBTC(exchange[i],exchange[j],tradingPairs[k],'currency');
					if (tempTrade != true) {
					}
					else {if (tempTrade[0] > topTrade [0]){
						console.log(topTrade+ ' ' + tempTrade);
						topTrade = tempTrade;
					}}
				}
			}
		}
	}
	console.log('Top Trade: ' + topTrade[3]);
	console.log('Sell '+ topTrade[4] +' '+ topTrade[3].slice(0,3) + ' on ' + topTrade[1] + ' for ' + topTrade [7] + ' ' + topTrade[3].slice(3,6));
	console.log('Buy ' +topTrade[5] +' '+ topTrade[3].slice(0,3) + ' on ' + topTrade[2] + ' for ' + topTrade [6] + ' ' + topTrade[3].slice(3,6));
	console.log('Profit/Loss: ' + topTrade[0]*100 + '%');
	console.log(topTrade[3].slice(3,6) + ' Net: ' + (topTrade[7]-topTrade[6]) + ' = $' + (topTrade[7]-topTrade[6])*poloniexMrkt['USDT_BTC'].last);
	console.log(topTrade[3].slice(0,3) + ' Net: ' + (topTrade[5]-topTrade[4]));
	console.log();
	if (topTrade[0] < triggerPercentage) {
		console.log('Minimum margin of ' + triggerPercentage * 100 + '% not met.');
	}
	else {
		console.log('MINIMUM MARGIN MET! Executing trade...');
		updateWallet(topTrade[1],topTrade[2],topTrade[3],topTrade[4],topTrade[5],topTrade[6],topTrade[7]);
		console.log('---------------------------------------');
		console.log('           NEW WALLET BALANCES');
		console.log('---------------------------------------');
		console.log(wallets);
	}
	// populate buy/ask table
	//console.log(buyAskTable);
	//console.log(binanceETH);
	//console.log(binanceLTC);
    // output - calculates net
    //console.log('===================');
    //console.log(prices);
    //console.log('RATIOS: G/P ', gdaxMrkt.price/coin1PoloniexPrice, 'P/G ', coin1PoloniexPrice/gdaxMrkt.price)
    //console.log('NET GAINS: $' + calculateNet(coin1, coin2, gdaxMrkt.price, coin1PoloniexPrice, coin1USD.price));
    //console.log('===================');
  })).catch(error => {
    // handle the error
    console.log(error);
  });
};

// calculates net gains
// params: names of coin1 and coind2, price in either exchange and the usd val of coin1
const calculateNet = (coin1, coin2, gdaxPrice, poloniexPrice, usd) => {
  // trading fees - need to confirm values for each ex
  const fees = 0.0025;

  // gdax coin1 -> coin2 trade
  const c1Toc2 = gdaxAcc[coin1] * gdaxPrice - (fees * gdaxAcc[coin1] * gdaxPrice);
  
  // polo coin2 -> coin1 trade
  const c2Toc1 = c1Toc2 / poloniexPrice - (fees * c1Toc2 / poloniexPrice);
  
  // coin gained or lost
  const diff = c2Toc1 - gdaxAcc[coin1];
  const netGains = diff * usd;

  return netGains;
}

//update wallet - sandbox wallet update.  takes (assetExchange, currencyExchange, assetPair, assetInput, assetOutput, currencyInput, currencyOutput) and updates wallet amounts
const updateWallet = (assetExchange, currencyExchange, assetPair, assetInput, assetOutput, currencyInput, currencyOutput) => {
	wallets[assetExchange][assetPair.slice(0,3)] = wallets[assetExchange][assetPair.slice(0,3)] - assetInput;
	wallets[assetExchange][assetPair.slice(3,6)] = wallets[assetExchange][assetPair.slice(3,6)] + currencyOutput;
	wallets[currencyExchange][assetPair.slice(3,6)] = wallets[currencyExchange][assetPair.slice(3,6)] - currencyInput;
	wallets[currencyExchange][assetPair.slice(0,3)] = wallets[currencyExchange][assetPair.slice(0,3)] + assetOutput;
}

const getMarginBTC = (assetExchange, currencyExchange, assetPair, profitCurrency) => {
	var asset = assetPair.slice(0,3);
	var currency = assetPair.slice(3,6);
	
	var assetRate = buyAskTable[assetExchange][assetPair].bid;
	var currencyRate = buyAskTable[currencyExchange][assetPair].ask;
	
	var assetExchangeFee = fees[assetExchange].taker;
	var currencyExchangeFee = fees[currencyExchange].taker;
	
	var assetAmt = wallets[assetExchange][asset];
	var currencyAmt = wallets[currencyExchange][currency];
	
	if (assetAmt < 0.01 || currencyAmt == 0.001) {
		return [-.99, assetExchange, currencyExchange, assetPair, assetInput, assetOutput, currencyInput, currencyOutput];
	}
	
	var currencyTOutput = assetRate*assetAmt*(1-assetExchangeFee);
	var assetTOutput = currencyAmt/currencyRate*(1-currencyExchangeFee);
	var assetInput = 0;
	var currencyInput = 0;
	
	if (currencyTOutput < currencyAmt) {
		assetInput = assetAmt;
		if (profitCurrency == 'currency'){
			currencyInput = assetInput*currencyRate/(1-currencyExchangeFee);
		}
		else {
			currencyInput = assetInput*assetRate*(1-assetExchangeFee);
		}
	}
	else {
		currencyInput = currencyAmt;
		if (profitCurrency == 'currency') {
			assetInput = currencyInput/currencyRate*(1-currencyExchangeFee);
		}
		else {
			assetInput = currencyInput/assetRate/(1-assetExchangeFee);
		}
	}
	
	var currencyOutput = assetInput*assetRate*(1-assetExchangeFee);
	var assetOutput = currencyInput/currencyRate*(1-currencyExchangeFee);
	var assetNet = assetOutput-assetInput;
	var currencyNet = currencyOutput-currencyInput;
	
	if (profitCurrency == 'asset'){
		var net = assetNet/assetInput;

		return [net.toFixed(6), assetExchange, currencyExchange, assetPair, assetInput, assetOutput, currencyInput, currencyOutput];
	}
	else {
		var net = currencyNet/currencyInput;

		return [net.toFixed(6), assetExchange, currencyExchange, assetPair, assetInput, assetOutput, currencyInput, currencyOutput];
	}
}

if(process.argv[2] && process.argv[3]) {
  const c1 = process.argv[2].toUpperCase();
  const c2 = process.argv[3].toUpperCase();
  
  loop = setInterval(() => {
    watchPair();
  }, 2000);
} else {
  console.log('Please enter coins to monitor');
}
