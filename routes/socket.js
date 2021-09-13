var express = require('express');
var router = express.Router();
var socket_io = require('socket.io');
var io = socket_io();
var socketApi = {};
socketApi.io = io;


//Binance Configuration
const binance = require('node-binance-api')().options({
  APIKEY: '',
  APISECRET: '',
  useServerTime: true // If you get timestamp errors, synchronize to server time at startup
})


//Socket connection
io.sockets.on('connection', function(socket){
  binance.websockets.depthCache(["BNBBTC"], function(symbol, depth) {
    let max = 10; // Only show the 10 best bids / asks (optional)
    let bids = binance.sortBids(depth.bids, max);
    let asks = binance.sortAsks(depth.asks, max);
    let bid  = Object.entries(bids).map(([k,v])=>[+k,v]);
    let ask  = Object.entries(asks).map(([k,v])=>[+k,v]);
    socket.emit('depth', { bids : bid, asks: ask })
  });
})




module.exports = {
  router,
  socketApi
};

