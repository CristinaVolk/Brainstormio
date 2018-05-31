
const mongoose = require('mongoose');
const CONFIG = require('./controllers/config.js');
const databaseController = require('./controllers/databaseController');

databaseController.open();

const Message = databaseController.get().model('chat');

module.exports=io=>{
  io.on('connection', function (socket) {
  console.log("USER CONNECTED...");
  socket.emit('connected', "You are connected! YEAH!");
  //create room
  socket.join('all');
  // handle new messages
  socket.on('msg',function(content){
    console.log("MSG", content);
    const obj={
      date: new Date(),
      content:content,
      username: socket.id
    };
    Message.create(obj, err=>{
      if (err) return console.error("Message", err);
      socket.emit("message", obj);
      socket.to('all').emit("message", obj);
    });
  });
});
}
