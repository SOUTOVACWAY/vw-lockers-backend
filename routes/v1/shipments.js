const mongoose = require('mongoose');
const router = require('express').Router();
const Shipment = mongoose.model('Shipment');
const Customer = mongoose.model('Customer');
const auth = require('../auth');

router.get('/', auth.required, auth.mustBeAdmin, (req, res, next) => {
  let query;
  let filter = {}

  if (req.query.customer) {
    filter.customer = req.query.customer;
  }

  Shipment.find(filter)
    .populate('customer', 'fullname')
    .then(shipments => {
      return res.json(shipments);
    }).catch(next);
});

router.post('/', auth.required, auth.mustBeAdmin, (req, res, next) => {
  const shipment = new Shipment(req.body);

  Customer.findById(req.body.customer)
    .then(customer => {
      if (!customer) {
        return res.status(403).json({ message: 'Customer not found' });
      }

      shipment.customer = req.body.customer;
      shipment.date = new Date();
      shipment.shipment_address = req.body.shipment_address;

      shipment.save()
        .then(shipment => {
          customer.stock.VWPACK += shipment.items.VWPACK;
          customer.stock.VWLAY += shipment.items.VWLAY;
          customer.stock.VWGO += shipment.items.VWGO;
          customer.stock.VWPLAY += shipment.items.VWPLAY;

          customer.save()
            .then(() => {
              return res.json(shipment);
            })
        })
    }).catch(next);
});

router.get('/:number', auth.required, auth.mustBeAdmin, (req, res, next) => {
  Shipment.findOne({ number: req.params.number })
    .populate('customer', 'fullname')
    .then(shipment => {
      if (!shipment) {
        return res.status(403).json({ message: 'Shipment does not exist' });
      }

      return res.json(shipment);
    }).catch(next);
});

router.put('/:number', auth.required, auth.mustBeAdmin, (req, res, next) => {
  Shipment.findOne({ number: req.params.number })
    .then(shipment => {
      if (!shipment) {
        return res.status(403).json({ message: 'Shipment does not exist' });
      }

      return shipment.save().then(shipment => {
        return res.json(shipment)
      })
    }).catch(next);
});

module.exports = router;


