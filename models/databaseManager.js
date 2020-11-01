const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/chatter', {useNewUrlParser: true, useUnifiedTopology: true})
.then(() => {
    console.log('connected.');
})
.catch(error => {
    consoel.log(error.message);
});

mongoose.set('useCreateIndex', true);