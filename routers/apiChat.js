const express = require('express');
const router = express.Router();

router.post('/', (req, res) => {
    console.log(req.body.chatName);
    console.log(req.body.friendsIds);
});

module.exports = router;