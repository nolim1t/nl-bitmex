const orders = require('./orders');
const position = require('./position');
const customrequest = require('./request');

module.exports = {
  getorders: orders.get,
  getposition: position.get,
  customrequest: customrequest
}
