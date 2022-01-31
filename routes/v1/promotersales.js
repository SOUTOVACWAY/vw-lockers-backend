const mongoose = require('mongoose');
const router = require('express').Router();
const PromoterSale = mongoose.model('PromoterSale');
const Machine = mongoose.model('Machine');
const auth = require('../auth');

function getStats(filter, res) {
    PromoterSale.find(filter)
      .then(promoterSales => {
          let response = {
              totalFees: 0.0,
              VWPACK: {
                  qty: 0,
                  fees: 0.0
              },
              VWLAY: {
                  qty: 0,
                  fees: 0.0
              },
              VWGO: {
                  qty: 0,
                  fees: 0.0
              }
          };
  
          promoterSales.forEach(promoterSale => {
              promoterSale.items.forEach(item => {
                  response[item["item"]]["qty"] += 1;
                  response[item["item"]]["fees"] += item["fee"];
                  response.totalFees += item["fee"];
              })
          });
  
        return res.json(response);
      });
}

router.get('/', auth.required, (req, res, next) => {
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

  getStats(filter, res);
});

router.get('/statsForMachine', (req, res, next) => {
    const token = auth.getToken(req)

    Machine.findOne({ token: token })
      .then(machine => {
        if (!machine) {
          return res.status(403).json({ message: 'Unauthorized access' });
        }
  
        let filter = {}

        filter.machine = machine._id;
      
        if (req.query.startDate && req.query.endDate) {
          let startDate = new Date(req.query.startDate);
          let endDate = new Date(req.query.endDate);
          endDate.setDate(endDate.getDate() + 1);
      
          startDate = startDate < machine.promoter_report_from_day ? machine.promoter_report_from_day : startDate;
          endDate = endDate > machine.promoter_report_to_day ? machine.promoter_report_to_day : endDate;

          filter.date = {$gte: startDate, $lte: endDate };
        }

        getStats(filter, res);
      })
});

router.post('/', (req, res, next) => {
  const token = auth.getToken(req)

  Machine.findOne({ _id: req.body.machine, token: token })
    .then(machine => {
      if (!machine) {
        return res.status(403).json({ message: 'Unauthorized access' });
      }

      const promoterSale = new PromoterSale(req.body);

      promoterSale.save()
        .then(promoterSale => {
          return res.json(promoterSale);
        }).catch(next);
    })
});

module.exports = router;
