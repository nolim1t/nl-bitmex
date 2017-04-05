const orders = require('./orders');
const position = require('./position');

module.exports = {
  getorders: orders.get,
  getposition: position.get
}
