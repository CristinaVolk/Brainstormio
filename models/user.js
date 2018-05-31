const mongoose = require('mongoose');
let Schema = mongoose.Schema;

const UserSchema = new Schema({
  name:{
    type: String,
    required: true,
  },
  surname:{
    type: String,
    required: true
  },
  email:{
    type: String,
    required: true,
  },
  password:{
    type: String,
    required: true,
  },
  isAdmin:{
    type:Boolean,
    default:false
  }
});


const connectWithDB = (connection) => {
  const User = connection.model('User', UserSchema, 'User');
}
 module.exports = connectWithDB;
