var express = require('express');            // [mvc] package
var session = require('express-session');    // [session] package
var path = require('path');
var favicon = require('serve-favicon');
var fs = require('fs');                      // [file] package
var fileStreamRotator = require('file-stream-rotator');

var logger = require('morgan');              // [log] package
var cookieParser = require('cookie-parser'); // [cookie] package
var bodyParser = require('body-parser');     // [html parser] package
var async = require('async');                // [async utilities for node and the browser] package

var sessionFilter = require('./filter/sessionFilter');
var CW = require('./utility/crawler');







var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({ resave: true, saveUninitialized: true, secret: 'ab1ced3fghi4jklmnopqrstuwvxyz', cookie: { maxAge: 60000*30 } })); // 建立 session




// 確認log 資料夾是否存在, 不存在則建立log 目錄
var logDirectory = __dirname + '/log';
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);

// create a rotating write stream
var accessLogStream = fileStreamRotator.getStream({
  date_format: 'YYYYMMDD',
  filename: logDirectory + '/access-%DATE%.log',
  frequency: 'daily',
  verbose: false
});

// setup the logger
app.use(logger('combined', {stream: accessLogStream}));



//var routes = require('./controllers/indexController');
//var users = require('./controllers/usersController');
// app.use('/', controller);
// app.use('/users', controller);

//app.use(sessionFilter);
app.use(require('./controllers'));



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});




/********** crawler start ***************/
var Crawler = new CW();
//Crawler.init();

var crawlerName = "crawler-1";
var flag = 0;

async.forever(function(callback) {
    
    console.info(" << forever start >>");
    setTimeout(function() {
        console.info(" forever...");
        console.info(" flag: " + flag);
        flag++;
        if (flag > 5) {
            callback({ message: "stop..." });
        } else {
            Crawler.init(crawlerName, function(result) {
                if (result && result.error) {
                   callback({ message: result.error });
                   return;   
                }
                callback(null);
            });
        }
    }, 10000);

}, function(err) {
    if (err) {
        console.info(" << forever stop >>");
        console.info(" forever error message: " + err.message);
    }

});










module.exports = app;
