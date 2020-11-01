const express = require('express');
const router = express.Router();
const userStuff = require('../models/user');

router.get('/', async (req, res) => {
    const users = await userStuff.User.find({});
    res.send({users: users});
})

router.post('/', async (req, res) => {

    // check for duplicates
    const duplicateLogin = await userStuff.User.find({login: req.body.login});
    if (duplicateLogin.length) {
        return res.status(400).send({error: 'This login is already in use.'});
    }
    
    const duplicateEmail = await userStuff.User.find({email: req.body.email});
    if (duplicateEmail.length) {
        return res.status(400).send({error: 'This email is already in use.'});
    }

    const validationResult = userStuff.validateUser(req.body);
    if (validationResult.error) {
        return res.status(400).send({error: validationResult.error.message});
    }

    const newUser = new userStuff.User ({
        login: req.body.login,
        email: req.body.email,
        password: req.body.password
    });

    newUser.save();
    res.status(200).redirect('/');
})

module.exports = router;