var express = require('express');
var router = express.Router();
var socket_io = require('socket.io');
var io = socket_io();
var socketApi = {};
socketApi.io = io;


//Binance Configuration
const binance = require('node-binance-api')().options({
  APIKEY: 'QFpmKiwJNOfDqC8FQ4S4zpZHBMksPT4GyWX9PgOAbSM8J8X8Z5ySeYgvPFFnlOrO',
  APISECRET: 'jIQ0vZqAnXgv5w9QGjESICoToHmVrUvqlyuCZDEQF39fNlPiyAtyAPmvJi5payIN',
  useServerTime: true // If you get timestamp errors, synchronize to server time at startup
})



  io.sockets.on('connection', function(socket){
    console.log('A user connected');

    binance.websockets.depthCache(["BNBBTC"], function(symbol, depth) {
      let max = 10; // Only show the 10 best bids / asks (optional)
      let bids = binance.sortBids(depth.bids, max);
      let asks = binance.sortAsks(depth.asks, max);
      socket.emit('depth', { bids : bids, asks: asks })
    });
      
     
  })

  

module.exports = {
  router,
  socketApi
};

