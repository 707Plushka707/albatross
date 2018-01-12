const fs = require('fs');

class Logger {
  getTimeStamp() {
    const today = new Date();
    let dd = today.getDate();
    let mm = today.getMonth() + 1;
    let hh = today.getHours();
    let mins = today.getMinutes();
    let ss = today.getSeconds();
    const yyyy = today.getFullYear();

    if (dd < 10) {
      dd = '0' + dd;
    }

    if (mm < 10) {
      mm = '0' + mm;
    }

    return mm + '-' + dd + '-' + yyyy + ' at ' + hh + ':' + mins + ':' + ss;
  }

  log(item, fileName, addTime = false, callback) {
    const timeStamp = this.getTimeStamp();
    let logStr = item;

    if (addTime) {
      logStr = timeStamp + '\n' + logStr;
    }

    fs.access(fileName, fs.constants.F_OK, err => {
      if (err) {
        fs.writeFile(fileName, logStr, err => {
          if (callback || err) {
            callback();
          }
        });
      } else {
        fs.appendFile(fileName, '\n' + logStr, err => {
          if (callback || err) {
            callback();
          }
        });
      }
    });
  }

  getTradeString(trade, paperWallet, start = true) {
    let tradeStr = '';

    if (start) {
      tradeStr =
        '\n' +
        this.getTimeStamp() +
        '\nBEFORE TRADE\nTrade ' +
        trade.market1.asset +
        ' to ' +
        trade.market1.currency +
        ' on ' +
        trade.market1.market +
        ' and ' +
        trade.market2.currency +
        ' to ' +
        trade.market2.asset +
        ' on ' +
        trade.market2.market +
        '\n';
    } else {
      tradeStr = '\n\nAFTER TRADE\n';
    }

    tradeStr +=
      trade.market1.market.toUpperCase() +
      ': ' +
      trade.market1.asset +
      ': ' +
      paperWallet[trade.market1.market][trade.market1.asset];
    tradeStr +=
      ' ' +
      trade.market1.currency +
      ': ' +
      paperWallet[trade.market1.market][trade.market1.currency];
    tradeStr +=
      '\n' +
      trade.market2.market.toUpperCase() +
      ': ' +
      trade.market2.asset +
      ': ' +
      paperWallet[trade.market2.market][trade.market2.asset];
    tradeStr +=
      ' ' +
      trade.market2.currency +
      ': ' +
      paperWallet[trade.market2.market][trade.market2.currency];

    if (!start) {
      tradeStr +=
        '\nNET: ' +
        trade.net +
        '\n\n=====================================================\n';
    }

    return tradeStr;
  }
}

module.exports = Logger;
