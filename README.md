# BitMex library

My own bitmex library

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
