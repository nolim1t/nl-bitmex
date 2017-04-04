var publicapi = require('./lib/public');
var privateapi = require('./lib/private');

module.exports = {
  instrument: (info, callback) => {
    publicapi.instrumentprice(info, function(instrumentcb) {
      callback(instrumentcb);
    });
  },
  openorders: (info, callback) => {
    privateapi.openorders(info, function(orderscb) {
      callback(orderscb.);
    })
  }
};
