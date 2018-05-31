const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt-nodejs');
const User = require('./databaseController').get().model('User');
const CONFIG = require('./config.js');


module.exports.isAuthentic = (req,res,next) => {

  console.log(req.headers);
  var token = req.headers['authorization'];
  console.log(req.headers);
  if (!token)
    return res.status(403).send({ auth: false, message: 'No token provided.' });
  jwt.verify(token, CONFIG.HASH_PASSWORD_SECRET, function(err, decoded) {
    if (err)
    return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
    // if everything good, save to request for use in other routes
    req.userId = decoded.id;
    next();
  });
};


module.exports.isAdmin = (req,res,next) => {
  let isAdmin = req.body.isAdmin;
  if(isAdmin == null) res.json({success:false, message:"couldn't get the information weather the user is admin or not"});
  if(!isAdmin) res.json({success:false, message: "user is not an admin so he is not authorized to take that action"})
  if(isAdmin) next();
};
