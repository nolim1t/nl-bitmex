# BitMex library

My own bitmex library. Reference library [here](https://github.com/BitMEX/api-connectors/blob/master/official-http/node-request/index.js)

## Example code

### Get Open orders

#### Parameters

* apikey (but can use environment variable too)
* apisecret (but can use environment variable too)
* siteprefix (Defaults to 'testnet')

```javascript
t.openorders({siteprefix: "www"}, function(c) {
  console.log(c);
});
```
