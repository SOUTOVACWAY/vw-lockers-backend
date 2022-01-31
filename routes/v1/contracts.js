const mongoose = require('mongoose');
const router = require('express').Router();
const Contract = mongoose.model('Contract');
const Machine = mongoose.model('Machine');
const auth = require('../auth');

router.get('/', auth.required, (req, res, next) => {
  let query;

  if (req.payload.role === 'ADMIN') {
    query = Contract.find();
  } else {
    query = Contract.find({ customer: req.payload.id });
  }

  query
    .populate('customer', 'number email fullname')
    .populate('machine', 'serial')
    .then(contracts => {
      return res.json(contracts);
    }).catch(next);
});

router.post('/', auth.required, auth.mustBeAdmin, (req, res, next) => {
  const contract = new Contract(req.body);

  return contract.save()
    .then(contract => {
      contract.toAuthJSON()
        .then(contract => {
          return res.json(contract);
        })
    })
    .catch(next);
});

router.put('/:number', auth.required, auth.mustBeAdmin, (req, res, next) => {
  Contract.findOne({ number: req.params.number })
    .then(contract => {
      if (!contract) {
        return res.status(403).json({ message: 'Contract does not exist' });
      }

      contract.status = req.body.status;
      contract.customer = req.body.customer;
      contract.machine = req.body.machine;
      contract.location = req.body.location;
      contract.startDate = req.body.startDate;
      contract.endDate = req.body.endDate;
      contract.saleCommission = req.body.saleCommission;
      contract.advCommission = req.body.advCommission;
      contract.fixedFee = req.body.fixedFee;
      contract.initialCash = req.body.initialCash;
      contract.comments = req.body.comments;
      contract.currency = req.body.currency;
      contract.supplyContactName = req.body.supplyContactName;
      contract.supplyContactPhone = req.body.supplyContactPhone;
      contract.supplyShippingAddress = req.body.supplyShippingAddress;
      contract.items = req.body.items;

      return contract.save()
        .then(contract => {
          contract.toAuthJSON()
            .then(contract => {
              return res.json(contract);
            })
        });
    }).catch(next);
});

router.get('/:number', auth.required, (req, res, next) => {
  Contract.findOne({ number: req.params.number })
    .then(contract => {
      if (!contract) {
        return res.status(403).json({ message: 'Contract does not exist' });
      }

      if (req.payload.role !== 'ADMIN' &&
          !contract.customer.equals(req.payload.id)) {
        return res.status(403).json({ message: 'Unauthorized access' });
      }

      if (req.query.populate && req.query.populate === 'true') {
        return contract.toAuthJSON()
          .then(contract => {
            return res.json(contract)
          })
      }

      return res.json(contract)
    }).catch(next);
});

module.exports = router;
