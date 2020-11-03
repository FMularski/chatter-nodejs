const mongoose = require('mongoose');

const invitationSchema = mongoose.Schema({
    senderId: {type: String, required: true},
    senderLogin: {type: String, required: true},
    receiverId: {type: String, required: true},
    chatId: {type: String, required: false},
});

const Invitation = mongoose.model('Invitation', invitationSchema);

module.exports.Invitation = Invitation;