const express = require('express');
const router = express.Router();
const { Invitation } = require('../models/invitation');
const { User } = require('../models/user');

router.get('/', async (req, res) => {
    const userId = req.session.userId;

    const friendsInvitations = await Invitation.find({receiverId: userId, chatId: {$eq: undefined}});
    const chatsInvitations = await Invitation.find({receiverId: userId, chatId: {$ne: undefined}});

    res.send({friendsInvitations: friendsInvitations, chatsInvitations: chatsInvitations});
})

router.post('/', async (req, res) => {
    const userId = req.session.userId;
    const user = await User.findOne({_id: userId});

    // check if invited exists
    const invited = await User.findOne({ login: req.body.userLogin});
    if(!invited) {
        return res.status(404).send({error: `User ${req.body.userLogin} not found.`});
    }

    // check if already a friend
    if ( user.friends.includes(invited._id)) {
        return res.status(400).send({error: `User ${invited.login} is already your friend.`});
    }

    // check if inviting yourself
    if(userId == invited._id) {
        return res.status(400).send({error: 'You cannot invite yourself.'});
    }

    // check if pending invitation
    const existing = await Invitation.findOne({senderId: userId, receiverId: invited._id});
    if (existing) {
        return res.status(400).send({error: `You have already invited ${req.body.userLogin}.`});
    }

    const invitation = new Invitation({
        senderId: userId,
        senderLogin: user.login,
        receiverId: invited._id
    });

    invitation.save();

    return res.status(200).redirect('/friends');

})

module.exports = router;