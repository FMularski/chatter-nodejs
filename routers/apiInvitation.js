const express = require('express');
const router = express.Router();
const { Invitation } = require('../models/invitation');
const { User } = require('../models/user');

router.post('/', async (req, res) => {
    const userId = req.session.userId;

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
        receiverId: invited._id
    });

    invitation.save();

    return res.status(200).redirect('/friends');

})

module.exports = router;