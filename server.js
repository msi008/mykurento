/*
* (C) Copyright 2014 Kurento (http://kurento.org/)
*
* All rights reserved. This program and the accompanying materials
* are made available under the terms of the GNU Lesser General Public License
* (LGPL) version 2.1 which accompanies this distribution, and is available at
* http://www.gnu.org/licenses/lgpl-2.1.html
*
* This library is distributed in the hope that it will be useful,
* but WITHOUT ANY WARRANTY; without even the implied warranty of
* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU
* Lesser General Public License for more details.
*/
var express = require('express');

// kurento required
var path = require('path');
var ws = require('ws');
var minimist = require('minimist');
var url = require('url');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var log = require('./log');
var fs    = require('fs');
var https = require('https');

var Constants = require('./app/constants');
// var Room = require('./app/models/room');
var passport = require('passport');    //用passport需要在这里引一下

var argv = require('./app/config/argv');
var key_opts = require('./app/config/key_opts');

/*
 * Server startup
 */
var app = express();

var asUrl = url.parse(argv.as_uri);
//console.log(asUrl,'fugang');
//var port = process.env.PORT || asUrl.port;
var port = process.env.PORT || 8000;

app.set('port', port);//
app.set('env', process.env.NODE_ENV || 'development');

// view engine setup
app.set('views', path.join(__dirname, 'app/views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
/**
 * 路由表
 */
//require('./app/routes/route')(app);//config routes
app.use("/",require("./app/routes/route"));//根路由
app.use("/user", require('./app/routes/users'));//用户管理
app.use(express.static(path.join(__dirname, '/assets')));
log.use(app);//加载日志

app.use(passport.initialize());

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});


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


var server = https.createServer(key_opts, app).listen(port, started);
server.on("error", onError);
server.on("listening",onListening);

var io = require('socket.io')(server);

require('./app/routes/sockets')(io);
require('./app/routes/socket')(io);

function started(){
    console.log('Kurento Tutorial & Express server listening on port ' + app.get('port'));
    console.log('Open ' + asUrl.protocol+'//'+asUrl.hostname+':'+port + ' with a WebRTC capable browser');
}

//var debug = require('debug')('xbm-paiban');

/**
 * HTTP异常事件处理函数
 */
function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
      ? 'Pipe ' + port
      : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * 事件绑定函数
 */
function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string'
      ? 'pipe ' + addr
      : 'port ' + addr.port;
 // debug('Listening on ' + bind);
}

module.exports = server;