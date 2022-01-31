const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');

// setup connection to the development DB
if (process.env.NODE_ENV === 'production') {
  mongoose.connect(process.env.MONGODB_URI);
} else {
  mongoose.connect('mongodb://vacway-dev:vacway-dev@localhost/vacway-dev');
  mongoose.set('debug', true);
}

autoIncrement.initialize(mongoose.connection);
require('../models/User');
const User = mongoose.model('User');

User.find()
.then(users => {
  users.forEach(user => {
    user.type = 'ROOT'

    return user.save();
  })
})
.catch(err => {
  console.log(err);
});
