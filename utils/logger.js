const fs = require('fs');

const logger = (item, fileName, addTime = false, callback) => {
  const getTimeStamp = () => {
    const today = new Date();
    let dd = today.getDate();
    let mm = today.getMonth() + 1; 
    const yyyy = today.getFullYear();
    
    if(dd < 10) 
    {
      dd = '0' + dd;
    } 

    if(mm < 10) {
      mm='0' + mm;
    }

    return mm + '-' + dd + '-' + yyyy;
  };

  const timeStamp = getTimeStamp();
  let logStr = item;

  if(typeof logStr === 'object') {
    logStr = JSON.stringify(logStr).replace(/{/g, '\n').replace(/}/g, '\n').replace(/,/g, '\n').trim();
  }

  if(addTime) {
    logStr = timeStamp + '\n' + logStr;
  }

  fs.access(fileName, fs.constants.F_OK, (err) => {
    if (err) {
      fs.writeFile(fileName, logStr, (err) => {  
        if (err) {
          throw err;
        }

        if (callback) {
          callback();
        }
      });
    }

    fs.appendFile(fileName, '\n' + logStr, (err) => {  
      if (err) {
        throw err;
      }

      if (callback) {
        callback();
      }
    });
  });
};

logger.getTradeString = (trade, paperWallet, start = true) => {
  let tradeStr = '';

  if (start) {
    tradeStr = '\nBEFORE TRADE\nTrade ' + trade.market1.asset + ' to ' + trade.market1.currency + ' on ' + trade.market1.market + ' and ' + trade.market2.currency + ' to ' + trade.market2.asset + ' on ' + trade.market2.market;
  }

  tradeStr += '\nAFTER TRADE\n' + trade.market1.market.toUpperCase() + ': ' + trade.market1.asset + ': ' +  paperWallet[trade.market1.market][trade.market1.asset];
  tradeStr += ' ' + trade.market1.currency + ': ' +  paperWallet[trade.market1.market][trade.market1.currency];
  tradeStr += '\n' + trade.market2.market.toUpperCase() + ': ' + trade.market2.asset + ': ' +  paperWallet[trade.market2.market][trade.market2.asset];
  tradeStr += ' ' + trade.market2.currency + ': ' +  paperWallet[trade.market2.market][trade.market2.currency];

  if (!start) {
    tradeStr += '\nNET: ' + trade.net + '\n\n=====================================================\n';
  }

  return tradeStr;
}

module.exports = logger;