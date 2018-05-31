const mongoose = require('mongoose');
let Schema = mongoose.Schema;

const chatSchema = new Schema({
  date:{type: Date},
  content:{type: String},
  username:{type: String}
},{
  versionKey: false,
  collection:"mongoosechat"
}
);


const connectWithDB = (connection) => {
  const chat = connection.model('chat', chatSchema, 'chat');
}
 module.exports = connectWithDB;
