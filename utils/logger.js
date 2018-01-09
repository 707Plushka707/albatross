const fs = require('fs');

const logger = (trade = '', wallet, fileName, callback) => {
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

  let tradeLog = trade ? getTimeStamp() + ' Traded ' + trade.market1.asset + trade.market1.currency + ' between ' + trade.market1.market + ' and ' + trade.market2.market + ' for a net of ' + trade.net + ' ' + trade.market1.currency + '\n' + JSON.stringify(wallet).replace(/{/g, '\n').replace(/}/g, '\n').replace(/,/g, '\n').trim() : getTimeStamp() + '$$$$$$$$======STARTING AN ALBATROSS SESSION=======$$$$$$' + '\n' + JSON.stringify(wallet).replace(/{/g, '\n').replace(/}/g, '\n').replace(/,/g, '\n').trim();
  tradeLog+=(JSON.stringify(trade));

  fs.access(fileName, fs.constants.F_OK, (err) => {
    if (err) {
      fs.writeFile(fileName, tradeLog, (err) => {  
        if (err) {
          throw err;
        }

        if (callback) {
          callback();
        }
      });
    }

    fs.appendFile(fileName, '\n\n' + tradeLog, (err) => {  
      if (err) {
        throw err;
      }

      if (callback) {
        callback();
      }
    });
  });
};

module.exports = logger;