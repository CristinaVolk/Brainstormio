
const mongoose = require('mongoose');
const CONFIG = require('./controllers/config.js');
const databaseController = require('./controllers/databaseController');

databaseController.open();

const Room = databaseController.get().model('Room');

module.exports=io=>{
  io.on('connection', function (socket) {
  console.log("USER CONNECTED...");
  socket.emit('connected', "You are connected! YEAH!");
  //create room
  socket.join('all');

  socket.on('newRoom', async (req, res)=>{
    try{
      const room = new Room(req.body);
      await Room.save();
      res.sendStatus(200);

      socket.emit('createRoom', req.body);
    }
    catch(err){
      res.sendStatus(500);
      console.log(err);
    }
});
})
}
