const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const Customer = mongoose.model('Customer');
const User = mongoose.model('User');

passport.use('user', new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password'
}, (email, password, done) => {
  User.findOne({email: email})
    .then(user => {
      if(!user || !user.validPassword(password)) {
        return done(null, false, { message: 'Invalid e-mail or password' });
      }

    return done(null, user);
    }).catch(done);
}));

passport.use('customer', new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password'
}, (email, password, done) => {
  Customer.findOne({email: email})
    .then(customer => {
      if(!customer || !customer.validPassword(password)) {
        return done(null, false, { message: 'Invalid e-mail or password' });
      }

    return done(null, customer);
    }).catch(done);
}));
