# BitMex library

My own bitmex library. Reference library [here](https://github.com/BitMEX/api-connectors/blob/master/official-http/node-request/index.js)

## Contributing

All contributions are welcome and appreciated. Open Source is a meritocracy who doesn't care who you are.

* Issues
* Pull Requests
* Donations (BTC: [14qd36n1viYAWzajZgaTQq4tPUZcEUtfcz](http://blockr.io/address/info/14qd36n1viYAWzajZgaTQq4tPUZcEUtfcz) / LTC: [LSGfxUoJSC3qYsTC6DwyvKvYfDwTVXrcE2](http://ltc.blockr.io/address/info/LSGfxUoJSC3qYsTC6DwyvKvYfDwTVXrcE2) / [Dollars](https://donate.nolim1t.co))

## Example code

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
