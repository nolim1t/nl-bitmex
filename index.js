var publicapi = require('./lib/public');
var privateapi = require('./lib/private');

module.exports = {
  instrument: (info, callback) => {
    publicapi.instrumentprice(info, (instrumentcb) => {
      callback(instrumentcb);
    })
  },
  openorders: (info, callback) => {
    privateapi.openorders(info, (orderscb) => {
      callback(orderscb);
    })
  },
  currentposition: (info, callback) => {
    privateapi.currentposition(info, (positioncb) => {
      callback(positioncb);
    })
  }
};
