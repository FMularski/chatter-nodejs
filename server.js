/* load env variables form .env */
require('dotenv').config();

/* imports */
const express = require('express');
const path = require('path');
const morgan = require('morgan');
const databaseManager = require('./models/databaseManager');
const { User } = require('./models/user');
const session = require('express-session');

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

app.use('/api/users', apiUser);

app.listen(port, () => {
    console.log(`listening on port ${port}...`);
})

app.get('/', (req, res) => {
    res.render('login_page', {error: req.query.error});
})

app.post('/login', async (req, res) => {
    const login = req.body.sign_in_login;
    const password = req.body.sign_in_password;

    const userInDb = await User.findOne({login: login});

    if(!userInDb) {
        const queryStringError = encodeURIComponent(`User '${login}' does not exist.`);
        return res.redirect('/?error=' + queryStringError);
    }
    
    if ( password !== userInDb.password) {
        const queryStringError  = encodeURIComponent('Invalid password.');
        return res.redirect('/?error=' + queryStringError);
    }

    req.session.userId = userInDb._id;
    res.redirect('/home');
})

app.get('/home', async (req, res) => {
    const userId = req.session.userId;

    const user = await User.findOne({_id: userId});
    console.log(user);
})
