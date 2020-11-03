const mongoose = require('mongoose');
const Joi = require('joi');

const userSchema = new mongoose.Schema({
    login: {type: String, required: true, unique: true, dropDups: true, minlength: 6},
    email: {type: String, required: true, unique: true, dropDups: true},
    password: {type: String, required: true, minlength: 6},
    friends: [String]
});

function validateUser(user){
    const schema = Joi.object({
        login: Joi.string()
        .alphanum()
        .min(6)
        .required(),

        email: Joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),

        password: Joi.string()
        .min(6)
        .required(),

        confirm: Joi.ref('password')
    });

    return schema.validate(user);
}

const User = mongoose.model('User', userSchema);

module.exports = {
    User: User,
    validateUser: validateUser
}