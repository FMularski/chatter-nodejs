/* load env variables form .env */
require('dotenv').config();

/* imports */
const express = require('express');
const path = require('path');
const morgan = require('morgan');

/* app */
const app = express();
const port = process.env.PORT || 3000;

/* static */
app.use(express.static(path.join(__dirname, 'public')));

/* ejs */
app.set('view engine', 'ejs');

/* middleware */
app.use(morgan('tiny'));

app.listen(port, () => {
    console.log(`listening on port ${port}...`);
})

app.get('/', (req, res) => {
    res.render('login_page');
})

