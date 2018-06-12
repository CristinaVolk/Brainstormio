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

  socket.on('new-Room', async (dataAboutRoom)=>{
    try{
      const room = new Room(dataAboutRoom);
      await Room.save();
//there should be functions for "newRoom" and "createRoom" events in client/js folder, where dataAboutRoom is sent by user
      socket.emit('create-room', dataAboutRoom);
    }
    catch(err){
      console.log(err);
    }
});

socket.on('add-user', async (userID, roomID)=>{
try{
    let user = await User.findById(userID);
    if(!user) console.log("couldn't find the user by its ID");
    else
    await Room.findByIdAndUpdate(roomID,
    {
      $push: {
          "user":userID
        }
    })
    
    socket.emit('user-add', userID);
}   catch (err) {
        console.log(err);
    }
});

socket.on('change-room-stage', async (stageOfSession, roomID)=>{
try{
    await Room.findByIdAndUpdate(roomID,{
      $addToSet:{
        "stage":stageOfSession
      }
    });
    socket.emit('change-session', "the session is changed:", stageOfSession);
}   catch (err) {
        console.log(err);
    }
});

socket.on('add-new-idea', async (newIdea, roomID)=>{
try{
    await Room.findByIdAndUpdate(roomID,{
      $pull:{
        "idea":newIdea
      }
    });
    socket.emit('change-session', "the session is changed:", stageOfSession);
}   catch (err) {
        console.log(err);
    }
});
})
}
