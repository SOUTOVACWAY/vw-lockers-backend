const mongoose = require('mongoose');
const router = require('express').Router();
const Incidence = mongoose.model('Incidence');
const Machine = mongoose.model('Machine');
const auth = require('../auth');

router.get('/', auth.required, (req, res, next) => {
  let query;
  let filter = {}

  if (req.query.machine) {
    filter.machine = req.query.machine;
  }

  if (req.query.status) {
    filter.status = req.query.status;
  }

  if (req.query.startDate && req.query.endDate) {
    const startDate = new Date(req.query.startDate);
    let endDate = new Date(req.query.endDate);
    endDate.setDate(endDate.getDate() + 1);

    filter.createdAt = {$gte: startDate, $lte: endDate };
  }

  if (req.payload.role === 'ADMIN') {
    query = Incidence.find(filter);
  } else {
    filter.customer = req.payload.id;
    query = Incidence.find(filter);
  }

  query
    .sort({createdAt: 'desc'})
    .populate('machine', 'serial')
    .populate('customer', 'fullname')
    .then(incidences => {
      return res.json(incidences);
    }).catch(next);
});

router.get('/csv', auth.required, (req, res, next) => {
  let query;
  let filter = {}

  if (req.query.machine) {
    filter.machine = req.query.machine;
  }

  if (req.query.status) {
    filter.status = req.query.status;
  }

  if (req.query.startDate && req.query.endDate) {
    const startDate = new Date(req.query.startDate);
    let endDate = new Date(req.query.endDate);
    endDate.setDate(endDate.getDate() + 1);

    filter.createdAt = {$gte: startDate, $lte: endDate };
  }

  if (req.payload.role === 'ADMIN') {
    query = Incidence.find(filter);
  } else {
    filter.customer = req.payload.id;
    query = Incidence.find(filter);
  }

  query
    .sort({createdAt: 'desc'})
    .populate('customer', 'fullname')
    .populate('machine', 'serial')
    
    .then(incidences => {
      res.statusCode = 200;
      res.setHeader('Access-Control-Expose-Headers', 'Content-disposition');
      res.setHeader('Content-disposition', 'attachment; filename=incidences.csv');
      res.setHeader('Content-Type', 'text/csv');

      res.write('Maquina,Cliente,Fecha,Hora,Estado,Detalles\r\n');

      incidences.forEach(incidence => {
        let date = new Date(incidence.createdAt);
        let dateFmt = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
        let timeFmt = date.toTimeString();

        res.write(`"${incidence.machine.serial}","${incidence.customer.fullname}","${dateFmt}","${timeFmt}",\
"${incidence.status}","${incidence.description}"\r\n`)
      });

      res.end();
    }).catch(next);

});

router.post('/', auth.required, auth.mustBeAdmin, (req, res, next) => {
  const incidence = new Incidence(req.body);

  incidence.save()
    .then(incidence => {
      return res.json(incidence);
    }).catch(next);
});

router.post('/report', (req, res, next) => {
  const token = auth.getToken(req)

  Machine.findOne({ _id: req.body.machine, token: token })
    .then(machine => {
      if (!machine) {
        return res.status(403).json({ message: 'Unauthorized access' });
      }

      const incidence = new Incidence(req.body);

      incidence.save()
        .then(incidence => {
          return res.json(incidence);
        }).catch(next);
    })
});

router.get('/:number', auth.required, (req, res, next) => {
  Incidence.findOne({ number: req.params.number })
    .populate('machine', 'serial')
    .populate('customer', 'fullname email phone')
    .then(incidence => {
      if (!incidence) {
        return res.status(403).json({ message: 'Incidence does not exist' });
      }

      if ((req.payload.role !== 'ADMIN') &&
          (!incidence.customer || !incidence.customer._id.equals(req.payload.id))) {
        return res.status(403).json({ message: 'Unauthorized access' });
      }

      return res.json(incidence);
    }).catch(next);
});

router.put('/:number', auth.required, auth.mustBeAdmin, (req, res, next) => {
  Incidence.findOne({ number: req.params.number })
    .then(incidence => {
      if (!incidence) {
        return res.status(403).json({ message: 'Incidence does not exist' });
      }

      if (req.body.description) {
        incidence.description = req.body.description
      }

      if (req.body.status) {
        incidence.status = req.body.status
      }

      return incidence.save().then(incidence => {
        return res.json(incidence)
      })
    }).catch(next);
});

module.exports = router;

