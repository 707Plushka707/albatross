const fs = require('fs');

class Logger {
  cleanJSON(jsonStr) {
    return jsonStr
      .slice(1)
      .replace(/${|"/g, '')
      .replace(/(:{|,|})/g, '\n')
      .trim();
  }

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
      logStr = '\n' + timeStamp + '\n' + logStr;
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

  /*
  date/time, trade counter, asset, currency, market1, market2, asset amt sold/bought, currency spent, currency gained

  for example:
  "1/15/18 10:04 AM", 1, "LTC", "ETH", "poloniex", "bittrex", 0.52099311523, 0.0163452892, 0.01637623461
  */
  getTradeString(trade) {
    const tradeString = [
      this.getTimeStamp(),
      trade.count,
      trade.market1.asset,
      trade.market1.currency,
      trade.market1.market,
      trade.market2.market,
      trade.data.asset,
      trade.data.currency,
      trade.data.gain
    ].join(', ');

    return tradeString;
  }
}

module.exports = Logger;
