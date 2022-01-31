const mongoose = require('mongoose');
const router = require('express').Router();
const Machine = mongoose.model('Machine');
const Customer = mongoose.model('Customer');
const auth = require('../auth');

router.get('/', auth.required, (req, res, next) => {
  let query;

  if (req.payload.role === 'ADMIN') {
    let filter = {}

    if (req.query.customer) {
      filter.customer = req.query.customer;
    }

    query = Machine.find(filter);
  } else {
    query = Machine.find({ customer: req.payload.id });
  }

  query
    .populate('contract', 'number location customer')
    .populate({
      path: 'customer',
      select: 'number fullname sector',
      populate: { path: 'sector' }})
    .then(machines => {
      return res.json(machines);
    }).catch(next);
});

router.post('/', auth.required, auth.mustBeAdmin, (req, res, next) => {
  const machine = new Machine(req.body);

  machine.save()
    .then(machine => {
      return res.json(machine);
    }).catch(next);
});

router.get('/config', (req, res, next) => {
  const token = auth.getToken(req)

  Machine.findOne({ token: token })
    .populate({
      path: 'contract',
      select: 'startDate endDate items currency'
    })
    .then(machine => {
      if (!machine) {
        return res.status(403).json({ message: 'Unauthorized access' });
      }

      // clear fields sent by the machine
      machine.last_signal = undefined;
      machine.cash_in_box = undefined;
      machine.stock_machine = undefined;
      machine.stock_storage = undefined;
      machine.stock_estimated = undefined;
      machine.bills_in_box = undefined;
      machine.coins_in_box = undefined;
      machine.coins_in_coiner = undefined;

      return res.json(machine);
    }).catch(next);
});

router.post('/withdrawal', (req, res, next) => {
  const token = auth.getToken(req)

  Machine.findOne({ token: token })
    .then(machine => {
      if (!machine) {
        return res.status(403).json({ message: 'Unauthorized access' });
      }

      description = `
        <p>
        <ul>
          <li>Identificación de la máquina: ${machine.serial}</li>
          <li>Fecha de realización de la caja: ${req.body.datetime}</li>
        </ul>
        <p/>
        <p>
        <ul>
          <li>Billetes 5€: ${req.body.bills_5}</li>
          <li>Billetes 10€: ${req.body.bills_10}</li>
          <li>Total en billetes: ${req.body.billsTotal} €</li>
          <li>Monedas 0,5€: ${req.body.coins_50c}</li>
          <li>Monedas 1€: ${req.body.coins_1}</li>
          <li>Monedas 2€: ${req.body.coins_2}</li>
          <li>Total en monedas: ${req.body.coinsTotal} €</li>
          <li>Tokens: ${req.body.tokens}</li>
        </ul>
        <p/>
        <p>
        <ul>
          <li>Ventas pagadas en cash: ${req.body.cashSales} €</li>
          <li>Dinero en maquina: ${req.body.total} €</li>
          <li>Cambio insertado: ${req.body.change} €</li>
        </ul>
        </p>
      `;

      to = 'cajas.vacwayone@gmail.com';
      if (machine.report_email) {
        to += `,${machine.report_email}`;
      }

      req.app.mailer.send('email', {
        to: to,
        subject: `Reporte de caja ${machine.serial}`,
        description: description
      }, (err) => {
          if (err) {
            return res.status(400).json({ message: 'Could not send e-mail' });
          }

          return res.json({ message: "success" });
      });
    }).catch(next)
});

router.post('/alive', (req, res, next) => {
  const token = auth.getToken(req)

  Machine.findOne({ token: token })
    .then(machine => {
      if (!machine) {
        return res.status(403).json({ message: 'Unauthorized access' });
      }

      machine.last_signal = Date.now();
      machine.sw_version = req.body.sw_version;

      if (req.body.status !== 'undefined') {
        machine.status = req.body.status;
      }

      if (req.body.fw_version !== 'undefined') {
        machine.fw_version = req.body.fw_version;
      }

      machine.stock_machine.VWPACK = req.body.stock_machine.VWPACK;
      machine.stock_machine.VWLAY = req.body.stock_machine.VWLAY;
      machine.stock_machine.VWGO = req.body.stock_machine.VWGO;
      machine.stock_machine.VWPLAY = req.body.stock_machine.VWPLAY;

      try {
        machine.stock_estimated.VWPACK = req.body.stock_estimated.VWPACK;
        machine.stock_estimated.VWLAY = req.body.stock_estimated.VWLAY;
        machine.stock_estimated.VWGO = req.body.stock_estimated.VWGO;
        machine.stock_estimated.VWPLAY = req.body.stock_estimated.VWPLAY;
      } catch(err) {
        machine.stock_estimated.VWPACK = 0;
        machine.stock_estimated.VWLAY = 0;
        machine.stock_estimated.VWGO = 0;
        machine.stock_estimated.VWPLAY = 0;
      }

      machine.bills_in_box.five = req.body.bills_in_box.five;
      machine.bills_in_box.ten = req.body.bills_in_box.ten;
      machine.bills_in_box.twenty = req.body.bills_in_box.twenty;

      machine.cash_in_box.fifty = req.body.cash_in_box.fifty;
      machine.cash_in_box.one = req.body.cash_in_box.one;
      machine.cash_in_box.two = req.body.cash_in_box.two;
      machine.cash_in_box.token = req.body.cash_in_box.token;

      machine.cash_in_coiner.fifty = req.body.cash_in_coiner.fifty;
      machine.cash_in_coiner.one = req.body.cash_in_coiner.one;
      machine.cash_in_coiner.two = req.body.cash_in_coiner.two;

      Customer.findOne({ _id: machine.customer})
        .then(customer => {
          if (!customer) {
            return res.status(403).json({ message: 'Unauthorized access' });
          }

          console.log(req.body)
          customer.stock.VWPACK -= req.body.refilled.VWPACK;
          if (customer.stock.VWPACK < 0) {
            customer.stock.VWPACK = 0
          }

          customer.stock.VWLAY -= req.body.refilled.VWLAY;
          if (customer.stock.VWLAY < 0) {
            customer.stock.VWLAY = 0
          }

          customer.stock.VWGO -= req.body.refilled.VWGO;
          if (customer.stock.VWGO < 0) {
            customer.stock.VWGO = 0
          }

          customer.stock.VWPLAY -= req.body.refilled.VWPLAY;
          if (customer.stock.VWPLAY < 0) {
            customer.stock.VWPLAY = 0
          }

          return machine.save()
            .then(machine => {
              return customer.save().then(customer => {
                return res.json({ message: "success" });
              })
            })
        })

    }).catch(next);
});

router.get('/:serial', auth.required, (req, res, next) => {
  Machine.findOne({serial: req.params.serial})
    .populate('contract', 'number location customer')
    .populate('customer', 'number fullname')
    .then(machine => {
      if (!machine) {
        return res.status(403).json({ message: 'Machine does not exist' });
      }

      if ((req.payload.role !== 'ADMIN') &&
          (!machine.customer || !machine.customer._id.equals(req.payload.id))) {
        return res.status(403).json({ message: 'Unauthorized access' });
      }

      return res.json(machine);
    }).catch(next);
});

router.put('/:serial', auth.required, auth.mustBeAdmin, (req, res, next) => {
  Machine.findOne({serial: req.params.serial})
    .then(machine => {
      if (!machine) {
        return res.status(403).json({ message: 'Machine does not exist' });
      }

      machine.serial = req.body.serial
      machine.type = req.body.type
      machine.build_date = req.body.build_date
      machine.comments = req.body.comments
      machine.tpv_serial = req.body.tpv_serial
      machine.tpv_tcod = req.body.tpv_tcod
      machine.tpv_max = req.body.tpv_max
      machine.sound_interval = req.body.sound_interval
      machine.night_mode_start = req.body.night_mode_start
      machine.night_mode_end = req.body.night_mode_end
      machine.pin = req.body.pin
      machine.token_value = req.body.token_value
      machine.token_sale_value = req.body.token_sale_value
      machine.report_email = req.body.report_email
      machine.bubbles_intensity = req.body.bubbles_intensity
      machine.reset_no_internet = req.body.reset_no_internet
      machine.enable_standby = req.body.enable_standby
      machine.promoter_fees.VWPACK = req.body.promoter_fees.VWPACK;
      machine.promoter_fees.VWLAY = req.body.promoter_fees.VWLAY;
      machine.promoter_fees.VWGO = req.body.promoter_fees.VWGO;
      machine.has_promoter = req.body.has_promoter;
      machine.promoter_report_from_day = req.body.promoter_report_from_day;
      machine.promoter_report_to_day = req.body.promoter_report_to_day;

      return machine.save().then(machine => {
        return res.json(machine)
      })
    }).catch(next);
});

router.delete('/:serial', auth.required, auth.mustBeAdmin, (req, res, next) => {
  Machine.findOne({serial: req.params.serial})
    .then(machine => {
      if (!machine) {
        return res.status(403).json({ message: 'Machine does not exist' });
      } else if (machine.customer) {
        return res.status(403).json({ message: 'Machine is allocated' });
      }

      machine.remove()
        .then(machine => {
          return res.json({ message: 'Success' });
        })

    }).catch(next);
});

module.exports = router;
