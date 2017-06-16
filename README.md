# BitMex library

[![npm version](https://badge.fury.io/js/nl-bitmex.svg)](https://badge.fury.io/js/nl-bitnex)

My own bitmex library. Reference library [here](https://github.com/BitMEX/api-connectors/blob/master/official-http/node-request/index.js)

## Installing

```bash
npm i nl-bitmex --save
```


## Disclaimers

As always, please test your code out on [testnet](https://testnet.bitmex.com) before going live just to make sure there's no bugs in this library.

## Contributing

All contributions are welcome and appreciated. Open Source is a meritocracy who doesn't care who you are.

* Issues
* Pull Requests
* Donations (BTC: [14qd36n1viYAWzajZgaTQq4tPUZcEUtfcz](http://blockr.io/address/info/14qd36n1viYAWzajZgaTQq4tPUZcEUtfcz) / LTC: [LSGfxUoJSC3qYsTC6DwyvKvYfDwTVXrcE2](http://ltc.blockr.io/address/info/LSGfxUoJSC3qYsTC6DwyvKvYfDwTVXrcE2) / [Dollars](https://donate.nolim1t.co))

## Example code

### Initializing

```javascript
const bitmex = require('nl-bitmex');
```

### Custom Requests

```javascript
// Get the contents of the users bitcoin wallet
bitmex.customprivate({siteprefix: "www", endpoint: "user/wallet", querystring: "currency=XBt", apikey: "r", apisecret: ""}, (cb) => {
  console.log(cb);
});

// Get deposit addresss
bitmex.customprivate({siteprefix: "www", endpoint: "user/depositAddress", apikey: "", apisecret: ""}, (cb) => {
  console.log(cb);
});
```

### Orders

#### Get Open orders

##### Parameters

* apikey (but can use environment variable too)
* apisecret (but can use environment variable too)
* siteprefix (Defaults to 'testnet')

##### Example code

```javascript
bitmex.orders({siteprefix: "www"}, function(c) {
  console.log(c);
});
```

### Adjust leverage

```javascript
bitmex.customprivate({siteprefix: "testnet", endpoint: "position/leverage", method: "POST", symbol: "ETHM17", leverage: 50,  apikey: "", apisecret: ""}, (cb) => {
  if (cb.message == "Done") {
    console.log(cb.result);
  } else if (cb.message == "Error") {
    console.log(cb.error);
  } else {
    console.log(cb.message);
  }
});
```

### Place an order

```javascript
bitmex.customprivate({siteprefix: "www", endpoint: "order", method: "POST", symbol: "XBTUSD", orderQty: 1, apikey: "", apisecret: ""}, (cb) => {
  console.log(cb);
});
```

### Place orders in bulk

```javascript
bitmex.customprivate({siteprefix: "testnet", endpoint: "order/bulk", method: "POST", orders: JSON.stringify([{symbol: "ETHM17", orderQty: 1, ordType: "Market", side: "Buy"}, {symbol: "ETHM17", orderQty: 1, ordType: "Market", side: "Buy"}]),  apikey: "xpdWaDC-40cQFxeJVzGqBsl9", apisecret: ""}, (cb) => {
  if (cb.message == "Done") {
    console.log(cb.result);
  } else if (cb.message == "Error") {
    console.log(cb.error);
  } else {
    console.log(cb.message);
  }
});
```

### Place a stop market

```javascript
bitmex.customprivate({siteprefix: "testnet", endpoint: "order", method: "POST", symbol: "ETHM17", orderQty: -5, ordType: "Stop", stopPx: "0.141", side: "Sell",  apikey: "", apisecret: ""}, (cb) => {
  if (cb.message == "Done") {
    console.log(cb.result);
  } else if (cb.message == "Error") {
    console.log(cb.error);
  } else {
    console.log(cb.message);
  }
});
```

### Place a take profit market Sell

```javascript
bitmex.customprivate({siteprefix: "testnet", endpoint: "order", method: "POST", symbol: "ETHM17", orderQty: -5, ordType: "MarketIfTouched", stopPx: "0.145", side: "Sell",  apikey: "", apisecret: ""}, (cb) => {
  if (cb.message == "Done") {
    console.log(cb.result);
  } else if (cb.message == "Error") {
    console.log(cb.error);
  } else {
    console.log(cb.message);
  }
});
```
### Cancel an Order (As long as its not filled)

```javascript
bitmex.customprivate({siteprefix: "www", endpoint: "order", method: "DELETE", querystring: "orderID=THEORDERID", apikey: "", apisecret: ""}, (cb) => {
  console.log(cb);
});
```

### Trading Positions

Useful for determining whether to close out a position early or not.

#### Get Position

This gets the positions of open and closed orders, or open only.

##### Parameters

* apikey (but can use environment variable too)
* apisecret (but can use environment variable too)
* siteprefix (Defaults to 'testnet')
* isopen (Defaults to false, which will show all positions open and closed)

##### Example code

The below code grabs the current open positions

```javascript
bitmex.position({siteprefix: "www", isopen: true}, function(c) {
  if (c.message == "Done") {
    for (var i = 0; i < c.position.length; i++) {
      var row = c.position[i];

      var symbol = row["symbol"];
      var currency = row["currency"];
      var underlyingCurrency = row["underlying"];
      var contractsCount = row["currentQty"];
      var realisedPnl = row["realisedPnl"];
      var unrealisedPnl = row["unrealisedPnl"];
      var openStatus = row["isOpen"];
      var costPrice = row["avgCostPrice"];
      var breakEvenPrice = row["breakEvenPrice"];
      var lastPrice = row["lastPrice"];
      var leverage = row["leverage"]

      console.log("Instrument (#" + (i + 1).toString() + "): " + symbol + " (" + underlyingCurrency + " bought with " + currency + ") QTY=" + contractsCount.toString() + " Open=" + openStatus.toString() + " bought at=" + costPrice.toString() + " currently: " + lastPrice.toString() + " (P/L: Realised: " + (realisedPnl / 100000).toString() + " mBTC Unrealised: " + (unrealisedPnl / 100000).toString() + " mBTC)");
    }
  } else if (c.message == "Error") {
    console.log("An error has occured: " + c.error);
  } else {
    console.log(c.message);
  }
});
```
