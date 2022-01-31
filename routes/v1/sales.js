const mongoose = require('mongoose');
const router = require('express').Router();
const Sale = mongoose.model('Sale');
const Machine = mongoose.model('Machine');
const auth = require('../auth');

router.get('/', auth.required, (req, res, next) => {
  let query;
  let filter = {}

  if (req.query.machine) {
    filter.machine = req.query.machine;
  }

  if (req.query.startDate && req.query.endDate) {
    const startDate = new Date(req.query.startDate);
    let endDate = new Date(req.query.endDate);
    endDate.setDate(endDate.getDate() + 1);

    filter.date = {$gte: startDate, $lte: endDate };
  }

  if (req.payload.role === 'ADMIN') {
    if (req.query.customer) {
      filter.customer = req.query.customer;
    }

    query = Sale.find(filter);
  } else {
    filter.customer = req.payload.id;
    query = Sale.find(filter);
  }

  query
    .populate('customer', 'number fullname')
    .populate('machine', 'serial')
    .populate('contract', 'currency')
    .sort({date: 'desc'})
    .then(sales => {
      return res.json(sales);
    }).catch(next);
});

router.get('/csv', auth.required, (req, res, next) => {
  let query;
  let filter = {}

  if (req.query.machine) {
    filter.machine = req.query.machine;
  }

  if (req.query.startDate && req.query.endDate) {
    const startDate = new Date(req.query.startDate);
    let endDate = new Date(req.query.endDate);
    endDate.setDate(endDate.getDate() + 1);

    filter.date = {$gte: startDate, $lte: endDate };
  }

  if (req.payload.role === 'ADMIN') {
    if (req.query.customer) {
      filter.customer = req.query.customer;
    }

    query = Sale.find(filter);
  } else {
    filter.customer = req.payload.id;
    query = Sale.find(filter);
  }

  query
    .populate('customer', 'fullname')
    .populate('machine', 'serial')
    .then(sales => {
      res.statusCode = 200;
      res.setHeader('Access-Control-Expose-Headers', 'Content-disposition');
      res.setHeader('Content-disposition', 'attachment; filename=sales.csv');
      res.setHeader('Content-Type', 'text/csv');

      res.write('Codigo,Fecha,Hora,Maquina,Cliente,Pago,Total\r\n');

      sales.forEach(sale => {
        let date = new Date(sale.date);
        let dateFmt = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
        let timeFmt = date.toTimeString();

        res.write(`"${sale.code}","${dateFmt}","${timeFmt}",\
"${sale.machine.serial}","${sale.customer.fullname}",\
"${sale.paymentMethod}","${sale.amount}"\r\n`)
      });

      res.end();
    }).catch(next);

});

router.get('/:number', auth.required, (req, res, next) => {
  Sale.findOne({number: req.params.number})
    .populate('customer', 'number fullname')
    .populate('machine', 'serial')
    .populate('contract', 'currency')
    .then(sale => {
      if (!sale) {
        return res.status(403).json({ message: 'Sale does not exist' });
      }

      if (req.payload.role !== 'ADMIN' &&
          !sale.customer._id.equals(req.payload.id)) {
        return res.status(403).json({ message: 'Unauthorized access' });
      }

      return res.json(sale);
    }).catch(next);
});

router.post('/', (req, res, next) => {
  const token = auth.getToken(req)

  Machine.findOne({ _id: req.body.machine, token: token })
    .then(machine => {
      if (!machine) {
        return res.status(403).json({ message: 'Unauthorized access' });
      }

      const sale = new Sale(req.body);

      sale.save()
        .then(sale => {
          return res.json(sale);
        }).catch(next);
    })
});

router.delete('/:id', auth.required, auth.mustBeAdmin, (req, res, next) => {
  Sale.findById(req.params.id)
    .then(sale => {
      if (!sale) {
        return res.status(403).json({ message: 'Sale does not exist' });
      }

      sale.remove()
        .then(sale => {
          return res.json({ message: 'Success' });
        })

    }).catch(next);
});

module.exports = router;

