const mongoose = require('mongoose');

const chatSchema = mongoose.Schema({
    chatName: { type:String, required:true },
    members: [{
        userId: String, 
        login: String, 
        owner: Boolean}],
    messages: [{
        messageId: String,
        authorId: String,
        authorLogin: String,
        date: String,
        text: String,
    }]
})

const Chat = mongoose.model('Chat', chatSchema);
module.exports.Chat = Chat;