var express = require('express');
var app = express();
const nunjucks = require('nunjucks');
var http = require('http').Server(app);
var io = require('socket.io')(http, {serveClient:true});
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const passport =require('passport');
const passportJWT = require("passport-jwt");
var ExtractJwt = passportJWT.ExtractJwt;
var Strategy = passportJWT.Strategy;
var favicon = require('serve-favicon');

const path = require('path');

var opts = {
  jwtFromRequest : ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey : "MyS3cr3tK3Y"
}
passport.use(new Strategy(opts, function(jwt_payload, done){
  if(jwt_payload!=void(0))  return done(false, jwt_payload);
  done();
}))

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

function checkAuth(req, res, next){
  passport.authenticate('jwt', { session: false }, (err, decryptToken, jwtError)=>{
    if(jwtError!=void(0)|| err!=void(0)) return res.render('index.html', {error: err || jwtError});
     req.user=decryptToken;
   next();
 }) (req, res, next);
}
app.get('/', checkAuth, function(req, res){
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
