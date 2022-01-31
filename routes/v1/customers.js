const mongoose = require('mongoose');
const router = require('express').Router();
const passport = require('passport');
const Customer = mongoose.model('Customer');
const auth = require('../auth');

router.get('/', auth.required, auth.mustBeAdmin, (req, res, next) => {
  Customer.find().then(customers => {
    return res.json(customers);
  }).catch(next);
});

router.post('/', auth.required, auth.mustBeAdmin, (req, res, next) => {
  const customer = new Customer(req.body);

  customer.setPassword(req.body.password);

  customer.stock.VWPACK = 0;
  customer.stock.VWLAY = 0;
  customer.stock.VWGO = 0;
  customer.stock.VWPLAY = 0;

  customer.save()
    .then(() => {
      return res.json(customer);
    })
    .catch(next);
});

router.put('/:number', auth.required, auth.mustBeAdmin, (req, res, next) => {
  Customer.findOne({number: req.params.number})
    .then(customer => {
      if (!customer) {
        return res.status(403).json({ message: 'Customer does not exist' });
      }

      customer.fullname = req.body.fullname;
      customer.email = req.body.email;
      customer.address = req.body.address;
      customer.phone = req.body.phone;
      customer.invoice_taxid = req.body.invoice_taxid;
      customer.invoice_address = req.body.invoice_address;
      customer.contact_person = req.body.contact_person;
      customer.phone2 = req.body.phone2;
      customer.fax = req.body.fax;
      customer.web = req.body.web;
      customer.language = req.body.language;
      customer.notes = req.body.notes;
      customer.social_name = req.body.social_name;
      customer.invoice_tax = req.body.invoice_tax;

      if (req.body.password) {
        customer.setPassword(req.body.password);
      }

      return customer.save()
        .then(() => {
          return res.json(customer);
        })
        .catch(next);
    }).catch(next);
});

router.get('/:number', auth.required, auth.mustBeAdmin, (req, res, next) => {
  Customer.findOne({number: req.params.number})
    .then(customer => {
      if (!customer) {
        return res.status(403).json({ message: 'Customer does not exist' });
      }

      return res.json(customer);
    }).catch(next);
});

module.exports = router;
