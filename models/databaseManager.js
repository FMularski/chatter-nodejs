const mongoose = require('mongoose');
const User = require('./user');

mongoose.connect('mongodb://localhost/chatter', {useNewUrlParser: true, useUnifiedTopology: true})
.then(() => {
    console.log('connected.');
})
.catch(error => {
    consoel.log(error.message);
});

function createUser(login, email, password) {
    const newUser = new User({
        login: login,
        email: email,
        password: password
    });

    newUser.save();
}

module.exports = {
    createUser: createUser
}