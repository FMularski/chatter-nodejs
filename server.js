/* load env variables form .env */
require('dotenv').config();

/* imports */
const express = require('express');
const path = require('path');
const morgan = require('morgan');
const databaseManager = require('./models/databaseManager');
const { User, validateUser } = require('./models/user');
const { Invitation }  = require('./models/invitation');
const { Chat } = require('./models/chat');
const session = require('express-session');
const flash = require('express-flash-messages');
const apiInvitation = require('./routers/apiInvitation');

const apiUser = require('./routers/apiUser');
const apiChat = require('./routers/apiChat');

/* app */
const app = express();
const port = process.env.PORT || 3000;

/* static */
app.use(express.static(path.join(__dirname, 'public')));

/* ejs */
app.set('view engine', 'ejs');

/* middleware */
app.use(morgan('tiny'));
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));
app.use(flash());

app.use('/api/users', apiUser);
app.use('/api/invitations', apiInvitation);
app.use('/api/chats', apiChat);

app.listen(port, () => {
    console.log(`listening on port ${port}...`);
})

app.get('/', (req, res) => {
    delete req.session.userId;
    res.render('login_page');
})

app.post('/register', async (req, res) => {

    // check for duplicates
    const duplicateLogin = await User.findOne({login: req.body.login});
    if (duplicateLogin) {
        req.flash('error', `Login '${req.body.login}' is already in use.`);
        return res.redirect('/');
    }
    
    const duplicateEmail = await User.findOne({email: req.body.email});
    if (duplicateEmail) {
        req.flash('error', `Email '${req.body.email}' is already in use.`);
        return res.redirect('/');
    }

    const validationResult = validateUser(req.body);
    if (validationResult.error) {
        req.flash('error', validationResult.error.message);
        return res.redirect('/');
    }

    const newUser = new User ({
        login: req.body.login,
        email: req.body.email,
        password: req.body.password
    });

    newUser.save();
    req.flash('success', `User '${req.body.login}' has been successfully created.`);
    return res.redirect('/');
})

app.post('/login', async (req, res) => {
    const login = req.body.sign_in_login;
    const password = req.body.sign_in_password;

    const userInDb = await User.findOne({login: login});

    if(!userInDb) {
        req.flash('error', `User '${login}' does not exist.`);
        return res.redirect('/');
    }
    
    if ( password !== userInDb.password) {
        req.flash('error', 'Invalid password.');
        return res.redirect('/');
    }

    req.session.userId = userInDb._id;
    res.redirect('/home');
})

app.get('/home', async (req, res) => {
    const userId = req.session.userId;
    const user = await User.findOne({_id: userId});
    
    if (!user) {
        return res.redirect('/');
    }

    const notificationCount = await getNotificationCount(userId);
    const chats = await Chat.find({'members.userId': {$in: userId}});
    
    res.render('home', {user: user, chats: chats, notificationCount: notificationCount});
})

app.get('/create_chat', async (req, res) => {
    const userId = req.session.userId;
    const user = await User.findOne({_id: userId});
    const notificationCount = await getNotificationCount(userId);
    
    if (!user) {
        return res.redirect('/');
    }

    res.render('create_chat', {user: user, notificationCount: notificationCount});
})

app.get('/find_chat', async (req, res) => {
    const userId = req.session.userId;
    const user = await User.findOne({_id: userId});
    const notificationCount = await getNotificationCount(userId);
    
    if (!user) {
        return res.redirect('/');
    }

    res.render('find_chat', {user: user, notificationCount: notificationCount});
})

app.get('/friends', async (req, res) => {
    const userId = req.session.userId;
    const user = await User.findOne({_id: userId});
    const notificationCount = await getNotificationCount(userId);
    
    if (!user) {
        return res.redirect('/');
    }

    res.render('friends', {user: user, notificationCount: notificationCount});
})

app.get('/chat/:id', async (req, res) => {
    const userId = req.session.userId;
    const user = await User.findOne({_id: userId});
    
    if (!user) { 
        return res.redirect('/');
    }

    const notificationCount = await getNotificationCount(userId);
    const chat = await Chat.findOne({_id: req.params.id});


    res.render('chat', {user: user, notificationCount: notificationCount, chat: chat });
})

app.get('/sign_out', (req, res) => {
    req.session.userId = undefined;
    req.flash('success', 'Signed out successfully.');
    res.redirect('/');
})

app.get('/get_friends', async (req, res) => {
    const user = await User.findOne({_id: req.session.userId});
    const friends = await User.find({friends: user._id}).select({login: 1});

    res.send({friends: friends});
})

app.post('/add_friend', async (req, res) => {
    const user = await User.findOne({_id: req.session.userId});
    const sender = await User.findOne({login: req.body.senderLogin});

    // add each other
    user.friends.push(sender._id);
    sender.friends.push(user._id);

    // remove pending invites
    await Invitation.deleteOne({senderId: sender._id, receiverId: user._id});
    await Invitation.deleteOne({senderId: user._id, receiverId: sender._id});

    user.save();
    sender.save();

    res.status(200).redirect('/friends');
});

app.post('/decline_friend', async (req, res) => {
    const user = await User.findOne({_id: req.session.userId});
    const sender = await User.findOne({login: req.body.senderLogin});

    await Invitation.deleteOne({senderId: sender._id, receiverId: user._id});
    await Invitation.deleteOne({senderId: user._id, receiverId: sender._id});

    res.status(200).redirect('/friends');
})

async function getNotificationCount(userId){ 
    return await Invitation.countDocuments({receiverId: userId});
}