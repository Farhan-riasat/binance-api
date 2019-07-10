var express = require('express');
var router = express.Router();

//Binance Configuration

const binance = require('node-binance-api')().options({
  APIKEY:'9Roef76CZNyQ3U2OVfKsgl9wOIyzo7MN5xm8FYNO6yUpdj4Qn0itgkueTiEjnkIm',
  APISECRET:'0E7TtFytLVJOyC6xgnTwaLsvuvGbIrUFtJragvXREBp7M08ofuxEWPbRJp0yWjhw',
  useServerTime: true, // If you get timestamp errors, synchronize to server time at startup
})

/* GET index page. */
router.get('/', function(req, res, next) {
  res.render('index')
});

/* GET available balances for currencies.. */
router.get('/balance', function (req, res, next) {
    binance.balance((error, balances) => {
      if ( error ) return console.error(error);
      console.log("balances: ", balances);
  });
});


/* Market Buy. */
router.get('/market-buy', function(req, res, next) {
  var quantity = 1;
  binance.marketBuy("BNBBTC", quantity, (error, response) => {
    console.log("Market Buy response", response);
    console.log("order id: " + response.orderId);
  })
});


/* Placing a LIMIT order */
router.get('/limit-Order', function(req, res, next) {
  var quantity = 1, price = 0.031712030;
  binance.buy("BNBBTC", quantity, price, {type:'LIMIT'}, (error, rense) => {
    console.log("Limit Buy response", rense);
    console.log("order id: " + rense.orderId);
  });
});



/* Bid and Ask detail for every coin */
router.get('/bid-Ask', function(req, res, next) {
  binance.bookTickers((error, ticker) => {
    if ( error ) return console.error(error);
    res.status(200).send(ticker);
  });
});




/* Chaining orders together */
router.get('/limitStop', function(req, res, next) {
  var quantity = 0.051;
binance.marketBuy("ETHBTC", quantity);
// binance.marketSell("ETHBTC", quantity);
});


/* cancel order */
router.get('/cancel', function(req, res, next) {
  var quantity = 0.017, price = 0.028851;
  binance.buy("ETHBTC", quantity, price, {type:'LIMIT'}, (error, response) => {
    console.log("Limit Buy response", response);
    console.log("order id: " + response.orderId);})
});


/* Get open orders for a symbol */
router.get('/openOrder', function(req, res, next) {
  binance.openOrders("ETHBTC", (error, openOrders, symbol) => {
    res.status(200).send({symbol, openOrders});
  });
});


/* Check an order's status */
router.get('/orderStatus', function(req, res, next) {
  let orderid = "396196408";
  binance.orderStatus("ETHBTC", orderid, (error, orderStatus, symbol) => {
    console.log(symbol+" order status:", orderStatus);
  });
});

/* Trade history for SNMBTC */
router.get('/history', function(req, res, next) {
  binance.trades("SNMBTC", (error, trades, symbol) => {
    console.log(symbol+" trade history", trades);
  });
});

/* Get all account orders; active, canceled, or filled. */
router.get('/allOrder', function(req, res, next) {
  binance.allOrders("ETHBTC", (error, orders, symbol) => {
    console.log(symbol+" orders:", orders);
  });
});


/* Get dust log */
router.get('/dustLog', function(req, res, next) {
  binance.dustLog((error, dustlog) => {
    console.log(dustlog);
  })
});


/* Get 24hr ticker price change statistics for all symbols */
router.get('/tickers', function(req, res, next) {
  binance.prevDay(false, (error, prevDay) => {
    // console.log(prevDay); // view all data
    for ( let obj of prevDay ) {
      let symbol = obj.symbol;
      res.status(200).send(symbol+" volume:"+obj.volume+" change: "+obj.priceChangePercent+"%");
    }
  });
});

/* Get 24hr ticker price change statistics for a symbol */
router.get('/symbolTicker', function(req, res, next) {
  binance.aggTrades("BNBBTC", {limit:500}, (error, response)=>{
    console.log("aggTrades", response);
  });
});


/* Get Kline/candlestick data for a symbol */
router.get('/candlestick', function(req, res, next) {
  binance.prevDay(false, (error, prevDay) => {
    let markets = [];
    for ( let obj of prevDay ) {
      let symbol = obj.symbol;
      console.log(symbol+" volume:"+obj.volume+" change: "+obj.priceChangePercent+"%");
      markets.push(symbol);
    }
    binance.websockets.candlesticks(markets, '1m', (candlestickData) => {
      let tick = binance.last(candlestickData);
      const symbol = candlestickData.s;
      const close = candlestickData[tick].c;
      console.log(symbol+": "+close);
    });
  });
})

module.exports = router;
