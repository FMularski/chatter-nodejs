const mongoose = require('mongoose');

const chatSchema = mongoose.Schema({
    chatName: { type:String, required:true },
    ownersIds: [String],
    membersIds: [String]
})

const Chat = mongoose.model('Chat', chatSchema);
module.exports = Chat;