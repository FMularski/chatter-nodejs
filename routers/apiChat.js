const express = require('express');
const router = express.Router();
const { Chat }  = require('../models/chat');
const { User } = require('../models/user');

router.get('/:id', async (req, res) => {

    const chatInDb = await Chat.findOne({_id: req.params.id});

    if (!chatInDb) {
        return res.status(404).send({error: 'Chat not found.'});
    }

    return res.send(chatInDb);
})

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
    });

    newChat.messages.push({
        authorId: "0",
        authorLogin: "sys",
        date: new Date().now,
        text: `${userInDb.login} created chat '${req.body.chatName}'`,
    });

    // add msgs about added users ( exclude the owner)
    members.forEach(member => {

        if (member.userId != userInDb._id){
            newChat.messages.push({
                authorId: "0",
                authorLogin: "sys",
                date: new Date().now,
                text: `${userInDb.login} added ${member.login} to the chat`
            });
        }

    });

    newChat.save();
    return res.status(200).redirect('/create_chat');
});

module.exports = router;