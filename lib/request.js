const request = require('request');
const isStringEmpty = require('fuckingundefinedemptynull').isStringSet;
const process = require('process');

// Utils
var headers = require('./headers');
var apiprefix = require('./apiprefix');
const assignFormParamsIfExist = require('assign-obj-params');

module.exports = (info, callback) => {
  var site = info.siteprefix || "testnet";
  var querystring = info.querystring || undefined;
  var endpoint = info.endpoint || "order";
  var path = apiprefix({endpoint: endpoint, version: "v1", querystring: querystring});
  var url = "https://" + site + ".bitmex.com" + path;
  var method = info["method"] || "GET";
  var apikey = info.apikey || process.env.APIKEY || "";
  var apisecret = info.apisecret || process.env.APISECRET || "";
  var requestInput =  {method: method, uri: url, headers: headers({path: path, verb: method, key: apikey, secret: apisecret})};
  if (method == "POST" || method == "PUT") {
    var formParams = {
    };
    // For Creating orders
    assignFormParamsIfExist(formParams, info, 'symbol');
    assignFormParamsIfExist(formParams, info, 'ordType'); //  Valid options: Market, Limit, Stop, StopLimit, MarketIfTouched, LimitIfTouched, MarketWithLeftOverAsLimit, Pegged. Defaults to 'Limit' when price is specified. Defaults to 'Stop' when stopPx is specified. Defaults to 'StopLimit' when price and stopPx are specified.
    assignFormParamsIfExist(formParams, info, 'orderQty');
    assignFormParamsIfExist(formParams, info, 'price');
    assignFormParamsIfExist(formParams, info, 'displayQty'); // displayQty = 0 for hidden orders
    assignFormParamsIfExist(formParams, info, 'stopPx'); // When to trigger this order
    assignFormParamsIfExist(formParams, info, 'timeInForce'); // Time in force. Valid options: Day, GoodTillCancel, ImmediateOrCancel, FillOrKill. Defaults to 'GoodTillCancel' for 'Limit', 'StopLimit', 'LimitIfTouched', and 'MarketWithLeftOverAsLimit' orders.
    assignFormParamsIfExist(formParams, info, 'text'); // Order annotation

    // Ammend order
    assignFormParamsIfExist(formParams, info, 'orderID');
    assignFormParamsIfExist(formParams, info, 'origClOrdID');

    requestInput['form'] = formParams; // Refer to https://www.bitmex.com/app/apiKeysUsage
  }
  request(requestInput, (error, response, body) => {
    if (!error) {
      var parsed;
      try {
        parsed = JSON.parse(body);
      } catch (e) {
        parsed = [];
      }
      if (parsed.error !== undefined) {
        callback({message: "Error", error: parsed.error.message});
      } else {
        callback({message: "Done", result: parsed});
      }
    } else {
      callback({message: "Error", error: error});
    }
  });
}
