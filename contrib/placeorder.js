#!/usr/bin/env node

/*
  Place order API on bitmex
*/

var bitmex = require('nl-bitmex');

/***********************************/

var NumberOfContracts = 10000; // How many contracts to buy
var SymbolRequested = 'XBTUSD'; // May not work with others
var LeverageRequested = 15; // How much leverage
var DollarsOffTheMarkPrice = 10; // Adjust to your liking

/* Base request prototype (contains API Key configurations) */
var baseRequest = function(siteprefix, apikey, apisecret) {
  this.siteprefix = 'testnet';
  this.apikey = 'APIKEY';
  this.apisecret = 'APISECRET'
}
/* Define requests based off base */
var AdjustLeverage = new baseRequest();
var WalletBalance = new baseRequest();
var PriceRequest = new baseRequest();
var OrderRequest = new baseRequest();
AdjustLeverage['endpoint'] = 'position/leverage';
AdjustLeverage['method'] = 'POST';
AdjustLeverage['symbol'] = SymbolRequested;
AdjustLeverage['leverage'] = LeverageRequested;
WalletBalance['endpoint'] = 'user/wallet';
WalletBalance['querystring'] = 'currency=XBt';
PriceRequest['endpoint'] = 'instrument';
PriceRequest['querystring'] = 'symbol=' + SymbolRequested;
OrderRequest['endpoint'] = 'order';
OrderRequest['method'] = 'POST';
OrderRequest['symbol'] = SymbolRequested;
OrderRequest['ordType'] = 'Limit';
OrderRequest['orderQty'] = NumberOfContracts;

// Lets start!
// Step 1: Adjust Leverage
bitmex.customprivate(AdjustLeverage, (cb) => {
  if (cb.message === "Done") {
    if (cb.result !== undefined || cb.result !== null) {
      if (cb.result.leverage !== undefined || cb.result.leverage !== null) {
        if (cb.result.leverage === AdjustLeverage.leverage) {
          console.log("Leverage set.. Lets work out balance");
          // Step 2: Get Wallet Balance
          bitmex.customprivate(WalletBalance, (bal) => {
            if (bal.message === "Done") {
              if (bal.result !== undefined || bal.result !== null) {
                if (bal.result.amount !== undefined || bal.result !== null) {
                  console.log('We have ' + bal.result.amount.toString() + ' sats to work with');
                  bitmex.customprivate(PriceRequest, (pricecb) => {
                    if (pricecb.message == "Done") {
                      if (pricecb.result !== undefined || pricecb.result !== null) {
                        if (pricecb.result.length === 1) {
                          if (pricecb.result[0].markPrice !== undefined || pricecb.result[0].markPrice !== null) {
                            // Step 3 get price
                            // Calculate how much the Contract would be and if we can afford it
                            var TotalContractValue = parseInt((NumberOfContracts/pricecb.result[0].markPrice) * 100000000);
                            var PriceWePay = parseInt(TotalContractValue/LeverageRequested);
                            if (bal.result.amount > PriceWePay) {
                              console.log("We can afford " + NumberOfContracts.toString() + " contracts at " + LeverageRequested.toString() + "x leverage");
                              // Step 4 place order
                              OrderRequest['price'] = parseInt(pricecb.result[0].markPrice - DollarsOffTheMarkPrice);

                              bitmex.customprivate(OrderRequest, (ordercb) => {
                                if (ordercb.message === "Done") {
                                  if (ordercb.result !== undefined || ordercb.result !== null) {
                                    console.log(ordercb.result);
                                  } else {
                                    console.log("Could not find result object of placing an order, but it seems successful")
                                  }
                                } else {
                                  if (ordercb.message === "Error") {
                                    console.log("There was an error placing the order");
                                    console.log(ordercb.error);
                                  }
                                }
                              });
                            } else {
                              console.log("We can't afford to place the order")
                            }
                          } else {
                            console.log("Could not get markPrice from Price API")
                          }
                        } else {
                          console.log("Unexpected price array result");
                        }
                      } else {
                        console.log("No Result from Price API");
                      }
                    } else {
                      console.log("Error from Price API (instruments)");
                    }
                  });
                } else {
                  console.log('No amount result found')
                }
              } else {
                console.log('No result object returned from WalletBalance')
              }
            } else {
                console.log("Error returned from WalletBalance")
            }
          });
        }
      }
    }
  } else if (cb.message == "Error") {
    console.log(cb.error);
  } else {
    console.log(cb.message);
  }
});
