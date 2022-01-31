const mongoose = require('mongoose');
const router = require('express').Router();
const Report = mongoose.model('Report');
const auth = require('../auth');

router.get('/', auth.required, auth.mustBeAdmin, (req, res, next) => {
  Report.find().then(reports => {
    return res.json(reports);
  }).catch(next);
});

router.post('/', auth.required, auth.mustBeAdmin, (req, res, next) => {
  const report = new Report(req.body);

  report.save()
    .then(() => {
      return res.json(report);
    })
    .catch(next);
});

router.put('/:number', auth.required, auth.mustBeAdmin, (req, res, next) => {
  Report.findOne({number: req.params.number})
    .then(report => {
      if (!report) {
        return res.status(403).json({ message: 'Report does not exist' });
      }

      report.start_date = req.body.start_date;
      report.finish_date = req.body.finish_date;
      report.customer1 = req.body.customer1;
      report.customer1_start = req.body.customer1_start;
      report.customer1_end = req.body.customer1_end;
      report.customer2 = req.body.customer2;
      report.customer2_start = req.body.customer2_start;
      report.customer2_end = req.body.customer2_end;
      report.customer3 = req.body.customer3;
      report.customer3_start = req.body.customer3_start;
      report.customer3_end = req.body.customer3_end;
      report.customer4 = req.body.customer4;
      report.customer4_start = req.body.customer4_start;
      report.customer4_end = req.body.customer4_end;
      report.motive = req.body.motive;
      report.personal1 = req.body.personal1;
      report.personal2 = req.body.personal2;
      report.personal3 = req.body.personal3;
      report.personal4 = req.body.personal4;
      report.coche_start = req.body.coche_start;
      report.coche_end = req.body.coche_end;
      report.hotel_price = req.body.hotel_price;
      report.transporte = req.body.transporte;
      report.transporte_price = req.body.transporte_price;
      report.concept1 = req.body.concept1;
      report.concept1_price = req.body.concept1_price;
      report.concept2 = req.body.concept2;
      report.concept2_price = req.body.concept2_price;
      report.concept3 = req.body.concept3;
      report.concept3_price = req.body.concept3_price;
      report.concept4 = req.body.concept4;
      report.concept4_price = req.body.concept4_price;
      report.concept5 = req.body.concept5;
      report.concept5_price = req.body.concept5_price;
      report.description = req.body.description;

      return report.save()
        .then(() => {
          return res.json(report);
        })
        .catch(next);
    }).catch(next);
});

router.get('/:number', auth.required, auth.mustBeAdmin, (req, res, next) => {
  Report.findOne({number: req.params.number})
    .then(report => {
      if (!report) {
        return res.status(403).json({ message: 'Report does not exist' });
      }

      return res.json(report);
    }).catch(next);
});

router.delete('/:number', auth.required, auth.mustBeAdmin, (req, res, next) => {
  Report.findOne({number: req.params.number})
    .then(report => {
      if (!report) {
        return res.status(403).json({ message: 'Report does not exist' });
      }

      report.remove()
        .then(report => {
          return res.json({ message: 'Success' });
        })

    }).catch(next);
});


module.exports = router;
