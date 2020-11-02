/* load env variables form .env */
require('dotenv').config();

/* imports */
const express = require('express');
const path = require('path');
const morgan = require('morgan');
const databaseManager = require('./models/databaseManager');
const { User, validateUser } = require('./models/user');
const session = require('express-session');
const flash = require('express-flash-messages');

const apiUser = require('./routers/apiUser');

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

app.listen(port, () => {
    console.log(`listening on port ${port}...`);
})

app.get('/', (req, res) => {
    req.session.userId = undefined;
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

    res.render('home', {user: user});
})

app.get('/create_chat', async (req, res) => {
    const userId = req.session.userId;
    const user = await User.findOne({_id: userId});
    
    if (!user) {
        return res.redirect('/');
    }

    res.render('create_chat', {user: user});
})

app.get('/find_chat', async (req, res) => {
    const userId = req.session.userId;
    const user = await User.findOne({_id: userId});
    
    if (!user) {
        return res.redirect('/');
    }

    res.render('find_chat', {user: user});
})

app.get('/friends', async (req, res) => {
    const userId = req.session.userId;
    const user = await User.findOne({_id: userId});
    
    if (!user) {
        return res.redirect('/');
    }

    res.render('friends', {user: user});
})

app.get('/sign_out', (req, res) => {
    req.session.userId = undefined;
    req.flash('success', 'Signed out successfully.');
    res.redirect('/');
})