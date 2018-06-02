const mongoose = require('mongoose');
let Schema = mongoose.Schema;

const roomSchema = new Schema({
        name: String, //name of the room
        description: String, //long description of a problem
        stage:Number, //stage of brainstorm session
        idea: [
            {
                content: String,
                votes: [Schema.Types.ObjectId], //id's of persons that votes
                author: Schema.Types.ObjectId //id of idea author
            }
        ],
        method: Number, //number of choosen method for example: 1- normal brainstorm, 2 - reversed brainstorm
        time: Date, //date of end session
        sessionDuration: Number, // [ms]
        user: [
            {
                _id: Schema.Types.ObjectId,
                name: String,
                picture: String
            }
        ],
        url: String, //unique url of brainstorm session - later it will be useful to find historical sessions
        maxVotes: Number //maximum number of votes by person
    });


const connectWithDB = (connection) => {
  const Room = connection.model('Room', roomSchema, 'Room');
}
 module.exports = connectWithDB;
