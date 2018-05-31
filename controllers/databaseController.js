const mongoose = require('mongoose');
const userModel = require('./../models/user');
const chatModel = require('./../models/chat');
const CONFIG=require('./config');
let _connection = null;

let open = function() {

  _connection = mongoose.createConnection(CONFIG.DB_URL, {
    auth:{
      password: CONFIG.DB_URL_AUTH.PASSWORD,
      user:CONFIG.DB_URL_AUTH.USER
    }
  });
              _connection.on("open", () => {
                  console.log("info", "Connected to DB");
              });
              _connection.on("disconnected", () => {
                  console.log("info", "Disconnected from DB");
              });
              _connection.on("error", () => {
                  console.log("error", "DB connection error");
              });
              mongoose.Promise = global.Promise;
              userModel(_connection);
              chatModel(_connection);
};

let get = () => {
  return _connection;
};

module.exports = {
  open : open,
  get : get
};
