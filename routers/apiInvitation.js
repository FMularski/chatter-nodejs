const express = require('express');
const router = express.Router();
const { Invitation } = require('../models/invitation');
const { User } = require('../models/user');

router.get('/', async (req, res) => {
    const userId = req.session.userId;

    const friendsInvitations = await Invitation.find({receiverId: userId, chatId: {$eq: 0}});
    const chatsInvitations = await Invitation.find({receiverId: userId, chatId: {$ne: 0}});

    res.send({friendsInvitations: friendsInvitations, chatsInvitations: chatsInvitations});
})

router.post('/', async (req, res) => {
    const userId = req.session.userId;
    const user = await User.findOne({_id: userId});

    const invited = await User.findOne({ login: req.body.userLogin});
    if(!invited) {
        return res.status(404).send({error: `User ${req.body.userLogin} not found.`});
    }

    if(userId == invited._id) {
        return res.status(400).send({error: 'You cannot invite yourself.'});
    }

    const existing = await Invitation.findOne({senderId: userId, receiverId: invited._id});
    if (existing) {
        return res.status(400).send({error: `You have already invited ${req.body.userLogin}.`});
    }

    const invitation = new Invitation({
        senderId: userId,
        senderLogin: user.login,
        receiverId: invited._id,
        chatId: 0
    });

    invitation.save();

    return res.status(200).redirect('/friends');

})

module.exports = router;