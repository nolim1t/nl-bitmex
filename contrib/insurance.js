#!/usr/bin/env node

/*
Check positions for corresponding stops. If none available, then place one
*/

var bitmex = require('nl-bitmex');

/***********************************/

/* Base request prototype (contains API Key configurations) */
var baseRequest = function(siteprefix, apikey, apisecret) {
  this.siteprefix = 'testnet';
  this.apikey = '';
  this.apisecret = ''
}
var PositionRequest = new baseRequest();
var OrderRequest = new baseRequest();
var StopOrderRequest = new baseRequest();
PositionRequest['isopen'] = 'true';
OrderRequest['endpoint'] = 'order';
StopOrderRequest['endpoint'] = 'order'
StopOrderRequest['method'] = 'POST';
StopOrderRequest['ordType'] = 'StopLimit';

bitmex.position(PositionRequest, (positioncb) => {
  if (positioncb.message === "Done") {
    if (positioncb.position !== null || positioncb.position !== undefined) {
      if (positioncb.position.length > 0) {
        for (var i = 0; i < positioncb.position.length; i++) {
          var positionObj = positioncb.position[i];
          // Find stops relating to the symbol
          OrderRequest['querystring'] = 'symbol=' + positionObj["symbol"] + '&filter=' + encodeURI(JSON.stringify({'ordStatus': 'New'}));
          bitmex.customprivate(OrderRequest, (orderscb) => {
            if (orderscb.message === "Done") {
              if (orderscb.result !== undefined || orderscb.result !== null) {
                if (orderscb.result.length === 0) { // Check if its 0
                  console.log("No Stops found..creating");
                  StopOrderRequest['symbol'] = positionObj["symbol"];
                  StopOrderRequest['orderQty'] = positionObj['currentQty'];
                  StopOrderRequest['stopPx'] = parseInt(positionObj['markPrice']) - 50;
                  StopOrderRequest['side'] = 'Sell';
                  StopOrderRequest['price'] = parseInt(positionObj['markPrice']) - 100;
                  bitmex.customprivate(StopOrderRequest, (stopordercb) => {
                    if (stopordercb.message === "Done") {
                      console.log("Stop Created!")
                    } else {
                      console.log("error creating stop order");
                      if (stopordercb.message === "Error") {
                        console.log(stopordercb.error);
                      } else {
                        console.log("Undefined error");
                      }
                    }
                  });
                } else { // Stop found
                  console.log("Stop found! Ignoring. We're probably good")
                }
              }
            } else {
              console.log("Error getting Stop orders");
            }
          })
        }
      } else {
        console.log("Nothing to process")
      }
    }
  }
})
