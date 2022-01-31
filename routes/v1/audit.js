const mongoose = require('mongoose');
const router = require('express').Router();
const AuditEntry = mongoose.model('AuditEntry');
const Machine = mongoose.model('Machine');
const auth = require('../auth');

router.get('/', auth.required, (req, res, next) => {
  let query;
  let filter = {}

  if (req.query.auditEntry) {
    filter.auditEntry = req.query.auditEntry;
  }

  if (req.query.startDate && req.query.endDate) {
    const startDate = new Date(req.query.startDate);
    let endDate = new Date(req.query.endDate);
    endDate.setDate(endDate.getDate() + 1);

    filter.date = {$gte: startDate, $lte: endDate };
  }

  if (req.query.machine) {
    filter.machine = req.query.machine;
  }

  if (req.query.type) {
    filter.type = req.query.type;
  }

  AuditEntry.find(filter)
    .sort({date: 'desc'})
    .populate('machine', 'serial')
    .then(auditEntries => {
      return res.json(auditEntries);
    }).catch(next);
});

router.get('/csv', auth.required, (req, res, next) => {
  let filter = {}

  if (req.query.auditEntry) {
    filter.auditEntry = req.query.auditEntry;
  }

  if (req.query.startDate && req.query.endDate) {
    const startDate = new Date(req.query.startDate);
    let endDate = new Date(req.query.endDate);
    endDate.setDate(endDate.getDate() + 1);

    filter.date = {$gte: startDate, $lte: endDate };
  }

  if (req.query.machine) {
    filter.machine = req.query.machine;
  }

  if (req.query.type) {
    filter.type = req.query.type;
  }

  AuditEntry.find(filter)
    .sort({date: 'desc'})
    .populate('machine', 'serial')
    .then(auditEntries => {
      res.statusCode = 200;
      res.setHeader('Access-Control-Expose-Headers', 'Content-disposition');
      res.setHeader('Content-disposition', 'attachment; filename=auditEntries.csv');
      res.setHeader('Content-Type', 'text/csv');

      res.write('Maquina,Fecha,Hora,Tipo,Detalles\r\n');

      auditEntries.forEach(auditEntry => {
        let date = new Date(auditEntry.date);
        let dateFmt = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
        let timeFmt = date.toTimeString();

        res.write(`"${auditEntry.machine.serial}","${dateFmt}","${timeFmt}",\
"${auditEntry.type}","${auditEntry.description}"\r\n`)
      });

      res.end();
    }).catch(next);
});

router.post('/', (req, res, next) => {
  const token = auth.getToken(req)

  Machine.findOne({ _id: req.body.machine, token: token })
    .then(machine => {
      if (!machine) {
        return res.status(403).json({ message: 'Unauthorized access' });
      }

      const auditEntry = new AuditEntry(req.body);

      auditEntry.save()
        .then(auditEntry => {
          return res.json(auditEntry);
        }).catch(next);
    })
});

module.exports = router;


