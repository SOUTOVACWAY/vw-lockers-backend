const mongoose = require('mongoose');
const router = require('express').Router();
const Machine = mongoose.model('Machine');
const Update = mongoose.model('Update');
const auth = require('../auth');

router.get('/check', (req, res, next) => {
  const token = auth.getToken(req)

  Machine.findOne({ token: token })
    .then(machine => {
      if (!machine) {
        return res.status(401).json({ message: 'Unauthorized access' });
      }

      Update.find()
        .then(updates => {
          return res.json(updates);
        })
    }).catch(next);
});

router.get('/', auth.required, auth.mustBeAdmin, (req, res, next) => {
  Update.find()
    .then(updates => {
      return res.json(updates);
    })
    .catch(next);
});

router.get('/:id', auth.required, auth.mustBeAdmin, (req, res, next) => {
  Update.findById(req.params.id)
    .then(updates => {
      return res.json(updates);
    })
    .catch(next);
});

router.put('/:id', auth.required, auth.mustBeAdmin, (req, res, next) => {
  Update.findById(req.params.id)
    .then(update => {
      if (!update) {
        return res.status(401).json({ message: 'Update does not exist' });
      }

      update.version = req.body.version
      update.applies_to = req.body.applies_to
      update.download_url = req.body.download_url

      return update.save().then(update => {
        return res.json(update)
      })
    }).catch(next);
});

router.post('/', auth.required, auth.mustBeAdmin, (req, res, next) => {
  const update = new Update(req.body);

  update.save()
    .then(update => {
      return res.json(update);
    }).catch(next);
});

module.exports = router;

