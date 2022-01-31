const mongoose = require('mongoose');
const router = require('express').Router();
const Machine = mongoose.model('Machine');
const RemoteAction = mongoose.model('RemoteAction');
const auth = require('../auth');

router.get('/poll', (req, res, next) => {
  const token = auth.getToken(req)

  Machine.findOne({ token: token })
    .then(machine => {
      if (!machine) {
        return res.status(403).json({ message: 'Unauthorized access' });
      }

      RemoteAction.find({ machine: machine.id, status: 'PENDING' })
        .then(remoteactions => {
          return res.json(remoteactions);
        })
    }).catch(next);
});

router.put('/:id', (req, res, next) => {
  RemoteAction.findById(req.params.id)
    .then(remoteaction => {
      if (!remoteaction) {
        return res.status(403).json({ message: 'Remote action does not exist' });
      }

      remoteaction.status = req.body.status
      remoteaction.result = req.body.result

      return remoteaction.save().then(remoteaction => {
        return res.json(remoteaction)
      })
    }).catch(next);
});

router.get('/:machine', auth.required, auth.mustBeAdmin, (req, res, next) => {
  Machine.findOne({ serial: req.params.machine })
    .then(machine => {
      if (!machine) {
        return res.status(403).json({ message: 'Machine does not exist' });
      }

      RemoteAction.find({ machine: machine.id })
        .sort({date: 'desc'})
        .then(remoteactions => {
          return res.json(remoteactions);
        })
    }).catch(next);
});

router.post('/', auth.required, auth.mustBeAdmin, (req, res, next) => {
  const remoteaction = new RemoteAction(req.body);

  remoteaction.date = Date.now()
  remoteaction.status = 'PENDING'

  remoteaction.save()
    .then(remoteaction => {
      return res.json(remoteaction);
    }).catch(next);
});

module.exports = router;

