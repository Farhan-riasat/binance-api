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


router.get('/', function(req, res, next) {
  //Socket connection
  io.sockets.on('connection', function(socket){
    console.log('A user connected');
    socket.on('hola', function(data){
        console.log(data);
      })
      binance.websockets.depth(['BNBBTC'], (depth) => {
        let {e:eventType, E:eventTime, s:symbol, u:updateId, b:bidDepth, a:askDepth} = depth;
        // console.log(symbol+" market depth update");
        // console.log(typeof(bidDepth))
        socket.emit('depth', { bids : bidDepth, asks: askDepth })
        // console.log(bidDepth, askDepth);
      });
  })
  res.render('index');
});


  

module.exports = {
  router,
  socketApi
};

