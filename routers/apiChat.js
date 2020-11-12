const express = require('express');
const router = express.Router();
const Chat = require('../models/chat');

router.post('/', (req, res) => {

    if (!req.body.chatName) {
        return res.status(400).send({error: 'You must enter a chat name.'});
    }

    if (!req.body.friendsIds.length) {
        return res.status(400).send({error: 'You must invite at least 1 friend to create a new chat.'});
    }

    const newChat = new Chat({
        chatName: req.body.chatName,
        ownersIds: [req.session.userId],
        membersIds: [req.session.userId].concat(req.body.friendsIds)
    })

    newChat.save();
    return res.status(200).redirect('/create_chat');
});

module.exports = router;