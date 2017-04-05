# BitMex library

My own bitmex library. Reference library [here](https://github.com/BitMEX/api-connectors/blob/master/official-http/node-request/index.js)

## Example code

### Orders

#### Get Open orders

##### Parameters

* apikey (but can use environment variable too)
* apisecret (but can use environment variable too)
* siteprefix (Defaults to 'testnet')

##### Example code

```javascript
t.openorders({siteprefix: "www"}, function(c) {
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

```javascript
t.currentposition({siteprefix: "www", isopen: true}, function(c) {
  console.log(c);
})
```
