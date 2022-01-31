const mongoose = require('mongoose');
const router = require('express').Router();
const passport = require('passport');

router.post('/', (req, res, next) => {
  if(!req.body.email){
    return res.status(422).json({
      message: 'Login failed',
      fields: {
        email: 'Can\'t be blank'
      }
    });
  }

  if(!req.body.password){
    return res.status(422).json({
      message: 'Login failed',
      fields: {
        password: 'Can\'t be blank'
      }
    });
  }

  passport.authenticate('customer', {session: false}, (err, customer, info) => {
      if (err) { return next(err); }

      if (customer) {
        customer.token = customer.generateJWT();
        return res.json(customer.toAuthJSON());
      } else {
        return res.status(422).json({ message: info.message });
      }
    })(req, res, next);
});

router.post('/admin', (req, res, next) => {
  if(!req.body.email){
    return res.status(422).json({
      message: 'Login failed',
      fields: {
        email: 'Can\'t be blank'
      }
    });
  }

  if(!req.body.password){
    return res.status(422).json({
      message: 'Login failed',
      fields: {
        password: 'Can\'t be blank'
      }
    });
  }

  passport.authenticate('user', {session: false}, (err, user, info) => {
      if (err) { return next(err); }

      if (user) {
        user.token = user.generateJWT();
        return res.json(user.toAuthJSON());
      } else {
        return res.status(422).json({ message: info.message });
      }
    })(req, res, next);
});

module.exports = router;
