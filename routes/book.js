const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const router = express.Router();
const bcrypt = require ('bcryptjs');
const async = require('async');
const jwt = require('jsonwebtoken');
const CONFIG = require('./../controllers/config.js');

const UserController = require('./../controllers/userController.js');
const User = require('./../controllers/databaseController').get().model('User');

router.get('/', async (req, res)=>{
  await res.json('Express RESTful API');
});


router.post('/register', async (req, res) => {
try {
  var name = req.body.name;
  var surname = req.body.surname;
  var email = req.body.email;
  var password = req.body.password;
  var password2 = req.body.password2;
  var isAdmin=req.body.isAdmin;

  req.checkBody('name', 'Name is required').notEmpty();
  req.checkBody('surname', 'Surname is required').notEmpty();
  req.checkBody('email', 'Email is required').notEmpty();
  req.checkBody('email', 'Email is not valid').isEmail();
  req.checkBody('password', 'Password is required').notEmpty();
  req.checkBody('password2', 'Passwords do not match').equals(req.body.password);
  req.checkBody('isAdmin').optional();

  let user = await User.findOne({ email: email });

  if(user){
    res.status(200).json('the user with that email is already registered');
  }
  if (!user){
    bcrypt.genSalt(10, (err, salt)=>{
      bcrypt.hash(password, salt, (error, hash)=>{
        if (err) console.log(err);
        let user =  new User({
        name,
        surname,
        email,
        password:hash}).save((err, result)=>{
          if (err) {
            console.log(err);
            return;
          } else {
            console.log(result);
            res.json(result);
          }
        });
      })
    })
  }

}   catch (err){
    res.json({success: false, message: "promise err"});
}
});

/*router.post('/register',  (req, res) => {

  var name = req.body.name;
  var surname = req.body.surname;
  var email = req.body.email;
  var password = req.body.password;
  var password2 = req.body.password2;
  var isAdmin=req.body.isAdmin;

  req.checkBody('name', 'Name is required').notEmpty();
  req.checkBody('surname', 'Surname is required').notEmpty();
  req.checkBody('email', 'Email is required').notEmpty();
  req.checkBody('email', 'Email is not valid').isEmail();
  req.checkBody('password', 'Password is required').notEmpty();
  req.checkBody('password2', 'Passwords do not match').equals(req.body.password);
  req.checkBody('isAdmin').optional();

  let errors = req.validationErrors();
  if (errors){
    console.log(errors);
  }else {
    User.findOne({
      email:email}, (err, us)=>{
        if (err){
          console.log(err);
          res.status(404).json(err);
        }
         if(us){
           res.status(200).json('the user with that email is already registered');
      }
      if(!us){
      bcrypt.genSalt(10, (err, salt)=>{
        bcrypt.hash(password, salt, (error, hash)=>{
          if (err) console.log(err);
          let user =  new User({
          name,
          surname,
          email,
          password:hash}).save((err, result)=>{
            if (err) {
              console.log(err);
              return;
            } else {
              console.log(result);
              res.json(result);
            }
          });
        })
      })
      }
    })
  }
});*/

router.post('/login', (req, res)=>{
  var email = req.body.email.toLowerCase();
  var password = req.body.password;

  req.checkBody('email', 'Email is required').notEmpty();
  req.checkBody('email', 'Email is not valid').isEmail();
  req.checkBody('password', 'Password is required').notEmpty();

  User.findOne({
    email:email
  }, (err, user)=>{
    if (err){
      console.log(err);
      res.status(400).json(err);
    }
     if(user) {
       if (bcrypt.compareSync(password, user.password)){
         jwt.sign({ id: user._id, name: user.name }, CONFIG.HASH_PASSWORD_SECRET, { expiresIn: '900000s' },  (err, token) => {
         res.status(200)
           .json({user,token,success: true})
         });
     }
     else {
      res.status(200).json({success: false, message: 'no hash, cannot log in'});
    }
  }
  else {
   res.status(200).json({success: false, message: "wrong data provided, cannot log in"})
 }
});
});




router.get('/me', UserController.isAuthentic, function(req, res, next) {
  User.findById(req.userId, { password: 0 }, function (err, user) {
    if (err) return res.status(500).send("There was a problem finding the user.");
    if (!user) return res.status(404).send("No user found.");
    else return res.status(200).send(user);
  });
});


router.get('/logout', function(req, res) {
  res.status(200).send({ auth: false, token: null });
});

module.exports = router;
