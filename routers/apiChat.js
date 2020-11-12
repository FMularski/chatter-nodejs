const express = require('express');
const router = express.Router();
const { Chat }  = require('../models/chat');
const { User } = require('../models/user');

router.post('/', async (req, res) => {

    if (!req.body.chatName) {
        return res.status(400).send({error: 'You must enter a chat name.'});
    }

    if (!req.body.friendsIds.length) {
        return res.status(400).send({error: 'You must invite at least 1 friend to create a new chat.'});
    }

    const userInDb = await User.findOne({_id: req.session.userId});

    // add first member - the user (with owner role)
    let members = [{userId: userInDb._id, login: userInDb.login, owner: true}];

    // add all selected friends
    for ( let i = 0; i < req.body.friendsIds.length; i++) {
        const invitedFriend = await User.findOne({_id: req.body.friendsIds[i]});
        members.push({userId: invitedFriend._id, login: invitedFriend.login, owner: false});
    }

    const newChat = new Chat({
        chatName: req.body.chatName,
        members: members
    })

    newChat.save();
    return res.status(200).redirect('/create_chat');
});

module.exports = router;