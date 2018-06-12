var express = require('express');
var app = express();
const nunjucks = require('nunjucks');
var http = require('http').Server(app);
var io = require('socket.io')(http, {serveClient:true, origins: '*:*'});
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');


var favicon = require('serve-favicon');


const path = require('path');

const book = require('./routes/book');
app.use(function(req, res) {

res.header('Access-Control-Allow-Origin', 'example.com');
res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
res.header('Access-Control-Allow-Headers', 'Content-Type');
});
//const book = require('./routes/book');
const cors = require('cors');
app.use(cors())
app.use(favicon(path.join(__dirname, 'client/public', 'favicon.ico')));
/*
nunjucks.configure('./client/views', {
    autoescape: true,
    express: app
});
*/
app.use(bodyParser.json());
app.use(expressValidator());
app.use(bodyParser.urlencoded({'extended':'false'}));
//app.use('/', book);

app.use('/assets', express.static('client/public'));
//app.use('/books', express.static(path.join(__dirname, 'src')));

require('./socket')(io);
//app.use('/', book);

http.listen(7777, function(){
  console.log('listening port 7777');
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  console.log(err);
  res.json('error!');
});


module.exports = app;
