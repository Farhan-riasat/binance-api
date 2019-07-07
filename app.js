var createError = require('http-errors');
var express = require('express');
var path = require('path');
var fs = require('fs')
var cookieParser = require('cookie-parser');
var morgan = require('morgan')
var rfs = require('rotating-file-stream')
var app = express();


var logDirectory = path.join(__dirname, 'log')
// ensure log directory exists
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory)
// create a rotating write stream
var accessLogStream = rfs('access.log', {
  interval: '1d', // rotate daily
  path: logDirectory
})
app.use(morgan('combined', { stream: accessLogStream }))
app.use(morgan('dev'))

var indexRouter = require('./routes/index');
var socketRouter = require('./routes/socket');


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/socket', socketRouter.router);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
