const request = require('request');
const isStringEmpty = require('fuckingundefinedemptynull').isStringSet;
var headers = require('./headers');

module.exports = {
  instrumentprice: (info, callback) => {
    if (isStringEmpty(info.symbol)) {
      var url = "https://www.bitmex.com/api/v1/instrument?symbol=" + info.symbol;
      request({method: "GET", uri: url, headers: headers({})}, function(error, response, body) {
        if (!error) {
          var parsed;
          try {
            parsed = JSON.parse(body);
          } catch (e) {
            parsed = [];
          }
          callback({message: "Done", result: parsed});
        } else {
          callback({message: "Error", error: error});
        }

      });
    } else {
      callback({message: "Invalid 'symbol'"});
    }
  }
}
