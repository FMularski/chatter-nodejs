const express = require('express');
const router = express.Router();
const User = require('../models/user');

router.get('/', async (req, res) => {
    const users = await User.find({});
    res.send({users: users});
})

router.post('/', async (req, res) => {
    const login = req.body.login;
    const email = req.body.email;
    const password = req.body.password;
    const confirm = req.body.confirm;

    // check for existing login
    const duplicateLogin = await User.find({login: login});

    if (duplicateLogin.length) {
        return res.status(400).send({error: 'This login is already in use.'});
    }
    
    // check for existing email
    const duplicateEmail = await User.find({email: email});

    if (duplicateEmail.length) {
        return res.status(400).send({error: 'This email is already in use.'});
    }

     // check for correct password confirmation
     if (password !== confirm) {
        return res.status(400).send({error: 'Password and password confirmation do not match.'});
    }

    const newUser = new User ({
        login: login,
        email: email,
        password: password
    });

    newUser.save();
    res.redirect('/');
})

module.exports = router;