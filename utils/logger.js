const fs = require('fs');

const logger = (str, fileName, callback) => {
  fs.access(fileName, fs.constants.F_OK, (err) => {
    if (err) {
      fs.writeFile(fileName, str, (err) => {  
        if (err) {
          throw err;
        }

        callback();
      });
    }

    fs.appendFile(fileName, '\n' + str, (err) => {  
      if (err) {
        throw err;
      }

      callback();
    });
  });
};

module.exports = logger;