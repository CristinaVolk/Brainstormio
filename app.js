var express = require('express');
var app = express();
const nunjucks = require('nunjucks');
var http = require('http').Server(app);
var io = require('socket.io')(http, {serveClient:true});
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
var favicon = require('serve-favicon');

const path = require('path');

//const book = require('./routes/book');

app.use(favicon(path.join(__dirname, 'client/public', 'favicon.ico')));

nunjucks.configure('./client/views', {
    autoescape: true,
    express: app
});

app.use(bodyParser.json());
app.use(expressValidator());
app.use(bodyParser.urlencoded({'extended':'false'}));
//app.use('/', book);

app.use('/assets', express.static('client/public'));
//app.use('/books', express.static(path.join(__dirname, 'src')));
app.get('/', function(req, res){
  res.render('index.html', {date: new Date()});
});

require('./socket')(io);


http.listen(7777, function(){
  console.log('listening on port 7777');
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
