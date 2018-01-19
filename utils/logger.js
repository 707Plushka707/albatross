const fs = require('fs');

/* Used for logging data to files */
class Logger {
  /*
    Takes a json string and removes all curly brackets and commas and adds newlines to allow for easy pasting into spreadsheets
    Params
    jsonStr: String of JSON Object
  */
  cleanJSON(jsonStr) {
    return jsonStr
      .slice(1)
      .replace(/${|"/g, '')
      .replace(/(:{|,|})/g, '\n')
      .trim();
  }

  /*
    Returns a time stamp in the format mm-dd-yyyy, hh:mm:ss
  */
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

    return mm + '-' + dd + '-' + yyyy + ', ' + hh + ':' + mins + ':' + ss;
  }

  /*
    File Logger for tracking orders.
    Params
    Item: String to log
    fileName: String name of the file to log to
    addTime (optional): Boolean to add a timestamp
    callback (optional): Function to run after logging
  */
  log(item, fileName, addTime = false, callback) {
    let logStr = item;

    if (addTime) {
      logStr = '\n' + this.getTimeStamp() + '\n' + logStr;
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
  Takes a trade and returns a string formatted for logging
  format = date/time, trade counter, asset, currency, market1, market2, asset amt sold/bought, currency spent, currency gained

  for example:
  "1/15/18 10:04 AM", 1, "LTC", "ETH", "poloniex", "bittrex", 0.52099311523, 0.0163452892, 0.01637623461

  Params
  trade: Object containing both markets involved in the trade and the data of currency/asset involved with the net currency gain
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
