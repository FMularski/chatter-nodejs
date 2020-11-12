const mongoose = require('mongoose');

const chatSchema = mongoose.Schema({
    chatName: { type:String, required:true },
    members: [{
        userId: String, 
        login: String, 
        owner: Boolean}]
})

const Chat = mongoose.model('Chat', chatSchema);
module.exports.Chat = Chat;