const express = require('express');
// const path = require('path');
const app = express();
let LAST_BTC_PRICE = 0;
let CURRENT_BTC_PRICE = 0;
const Api = require('./apiFunc');
const {allOrders} = require('./exirApi');

function increase(PRICE,num){

  return (PRICE + Number(((PRICE*num)/100).toFixed(2)) )
}


function decrease(PRICE,num){

  let number = Number(((PRICE*num)/100).toFixed(2))
  return Number((PRICE - number).toFixed(2)) 
}

function bitStampTicker() {
  const bMClient = new Api('https://www.bitstamp.net/api/ticker/')
  LAST_BTC_PRICE = Number(CURRENT_BTC_PRICE);
  let increasedValue = increase(LAST_BTC_PRICE,1);//changing 10% price goes up
  let decreasedValue = decrease(LAST_BTC_PRICE,1); // changing price 10% goes down
  console.log(increasedValue,decreasedValue)

  bMClient.bMTicker()
    .then( async res => {
        try{
          response = JSON.parse(res)
          CURRENT_BTC_PRICE = response.last;

        }catch(err){
          console.log(err)
        }
        if (LAST_BTC_PRICE !== 0 && CURRENT_BTC_PRICE >=  increasedValue) { // crypto price is increased so SELL side is chosen 
          console.log("10% is increased")
          exirOrderBook("sell");

        } else if(LAST_BTC_PRICE !== 0 && CURRENT_BTC_PRICE <=  decreasedValue) { // crypto price is decreased so BUY side is chosen 
          console.log("10% has been reduced")
          exirOrderBook("buy");          
        } else{
          console.log("no rule is applied ")
          ;
        }
    })
    .catch( err => {
      console.log(err)
    })
}

function exirOrderBook(side) {

   const exirClient = new Api('https://api.testnet.exir.io/v0/orderbooks?symbol=btc-tmn') //https://api.exir.io/v0/orderbooks?symbol=btc-tmn
    exirClient.exOrderBook()
    .then( res => {
      try{
          response = JSON.parse(res)
          buy = response["btc-tmn"].bids[0][0]
          sell = response["btc-tmn"].asks[0][0]
      }catch(e){
        console.log(e)
      }
      if (side === "buy") {
        decreasedBuy = decrease(buy,10); //percentage of removing orders
        allOrders('buy',decreasedBuy)
      }
      else if (side === "sell") {
        console.log("sell price", sell)
        increasedSell = increase(sell,10); // percentage of removing orders
        allOrders('sell',increasedSell)
      }
    })
    .catch( err => { console.log(err)})

}

bitStampTicker();
setInterval(bitStampTicker,600000 ) // changing the time 

port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server running on port ${port}`));

process.on('exit', () => {
  server.close();
});

