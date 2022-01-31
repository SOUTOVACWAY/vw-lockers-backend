const mongoose = require('mongoose');
const router = require('express').Router();
const passport = require('passport');
const User = mongoose.model('User');
const auth = require('../auth');

router.get('/', auth.required, auth.mustBeAdmin, (req, res, next) => {
  User.find().then(users => {
    return res.json(users);
  }).catch(next);
});

router.post('/', auth.required, auth.mustBeAdmin, (req, res, next) => {
  const user = new User(req.body);

  user.setPassword(req.body.password);

  user.save()
    .then(() => {
      return res.json(user);
    })
    .catch(next);
});

router.put('/:number', auth.required, auth.mustBeAdmin, (req, res, next) => {
  User.findOne({number: req.params.number})
    .then(user => {
      if (!user) {
        return res.status(403).json({ message: 'User does not exist' });
      }

      user.fullname = req.body.fullname;
      user.email = req.body.email;
      user.type = req.body.type;

      if (req.body.password) {
        user.setPassword(req.body.password);
      }

      return user.save()
        .then(() => {
          return res.json(user);
        })
        .catch(next);
    }).catch(next);
});

router.get('/:number', auth.required, auth.mustBeAdmin, (req, res, next) => {
  User.findOne({number: req.params.number})
    .then(user => {
      if (!user) {
        return res.status(403).json({ message: 'User does not exist' });
      }

      return res.json(user);
    }).catch(next);
});

module.exports = router;
