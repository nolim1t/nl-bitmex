var publicapi = require('./lib/public');
var privateapi = require('./lib/private');

module.exports = {
  instrument: (info, callback) => {
    publicapi.instrumentprice(info, (instrumentcb) => {
      callback(instrumentcb);
    })
  },
  orders: (info, callback) => {
    privateapi.getorders(info, (orderscb) => {
      callback(orderscb);
    })
  },
  position: (info, callback) => {
    privateapi.getposition(info, (positioncb) => {
      callback(positioncb);
    })
  }
};
