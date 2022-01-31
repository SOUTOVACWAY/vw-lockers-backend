const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');
const crypto = require('crypto');

// setup connection to the development DB
if (process.env.NODE_ENV === 'production') {
  mongoose.connect(process.env.MONGODB_URI);
} else {
  mongoose.connect('mongodb://vacway-dev:vacway-dev@localhost/vacway-dev');
  mongoose.set('debug', true);
}

autoIncrement.initialize(mongoose.connection);

require('../models/User');
require('../models/Machine');
require('../models/Incidence');
require('../models/Sector');
require('../models/Contract');
require('../models/Sale');
require('../models/Report');
require('../models/Customer');
require('../models/RemoteAction');
require('../models/Shipment');

const IdentityCounter = mongoose.model('IdentityCounter');

const User = mongoose.model('User');
const Machine = mongoose.model('Machine');
const Incidence = mongoose.model('Incidence');
const Sector = mongoose.model('Sector');
const Contract = mongoose.model('Contract');
const Sale = mongoose.model('Sale');
const Customer = mongoose.model('Customer');
const RemoteAction= mongoose.model('RemoteAction');
const Shipment = mongoose.model('Shipment');

// test data -------------------------------------------------------------------

// sectors
const sectorAquaticParks = new Sector({
  description: 'Parques Aquáticos'
});

const sectorSpasWellness = new Sector({
  description: 'Spas y Bienestar'
});

// users
const userAdmin = new User({
  email: 'demo@admin.com',
  fullname: 'Administrator',
  type: 'ROOT'
});

userAdmin.setPassword('demo');

// reports
const report1 = new Report({
  start_date: Date.now(),
  finish_date: Date.now(),
  customer1: customer1._id,
  customer1_start: 20,
  customer1_end: 20,
  customer2: customer1._id,
  customer2_start: 20,
  customer2_end: 20,
  customer3: customer1._id,
  customer3_start: 20,
  customer3_end: 20,
  customer4: customer1._id,
  customer4_start: 20,
  customer4_end: 20,
  motive: 'Reparacion',
  personal1: 'Daniel',
  personal2: 'Daniel',
  personal3: 'Daniel',
  personal4: 'Daniel',
  coche_start: 39000,
  coche_end: 40000,
  hotel_price: 20,
  transporte: 'Coche',
  transporte_price: 20,
  concept1: 'parking',
  concept1_price: 20,
  concept2: 'gasolina',
  concept2_price: 20,
  concept3: 'dieta',
  concept3_price: 20,
  concept4: 'extra',
  concept4_price: 20,
  concept5: 'peaje',
  concept5_price: 20,
  description:'VACWAYone'
});

// customers
const customer1 = new Customer({
  email: 'demo@customer1.com',
  fullname: 'Customer 1 S.L.',
  address: 'Av. Demo num. 1\n08080 Barcelona',
  phone: '+34 987654321',
  sector: sectorAquaticParks._id,
  invoice_taxid: '13334434Z',
  invoice_address: '5th Avenue 456\n90990 New York, NY, USA',
});

customer1.setPassword('demo');

const customer2 = new Customer({
  email: 'demo@customer2.com',
  fullname: 'Customer 2 S.L.',
  address: 'Av. Demo num. 1\n08080 Barcelona',
  phone: '+34 987654321',
  sector: sectorSpasWellness._id,
  invoice_taxid: '13334434Z',
  invoice_address: '5th Avenue 456\n90990 New York, NY, USA',
});

customer2.setPassword('demo');

// machines
const machine1 = new Machine({
  type: 'VACWAYone',
  build_date: Date.now(),
  last_signal: Date.now(),
  tpv_serial: '41100096',
  tpv_tcod: '',
  tpv_max: 20,
  night_mode_start: 22,
  night_mode_end: 8,
  sound_interval: 3,
  token_value: 5,
  report_email: 'test@test.com',
  reset_no_internet: false,
  bubbles_intensity: 40,
  enable_standby: false
});

const machine2 = new Machine({
  type: 'VACWAYmini',
  build_date: Date.now(),
  night_mode_start: 22,
  night_mode_end: 8,
  sound_interval: 3,
  token_value: 5,
  report_email: 'test@test.com',
  reset_no_internet: false,
  bubbles_intensity: 40,
  enable_standby: false
});

const machine3 = new Machine({
  type: 'VACWAYone',
  build_date: Date.now(),
  night_mode_start: 22,
  night_mode_end: 8,
  sound_interval: 3,
  token_value: 5,
  report_email: 'test@test.com',
  reset_no_internet: false,
  bubbles_intensity: 40,
  enable_standby: false
});

// remote actions
const action1 = new RemoteAction({
  date: Date.now(),
  machine: machine1._id,
  code: 'COMMAND',
  arguments: 'ls -l ~',
  status: 'PENDING',
  result: ''
});

const action2 = new RemoteAction({
  date: Date.now(),
  machine: machine1._id,
  code: 'COMMAND',
  arguments: 'ls /dev',
  status: 'COMPLETE',
  result: 'Fake!'
});

// contracts
const contract1 = new Contract({
  customer: customer1._id,
  machine: machine1._id,
  location: '41.6309248,2.1546689',
  startDate: new Date('2018-06-01'),
  endDate: new Date('2018-09-30'),
  saleCommission: 25,
  advCommission: 50,
  fixedFee: 150,
  currency: 'EUR',
  supplyContactName: 'Josep Bec Ari',
  supplyContactEmail: 'josep@becarios.com',
  supplyContactPhone: '+34 678123456',
  supplyShippingAddress: 'Av. Demo 34\n08080 Barcelona',
  items: [
    { item: 'VWPACK', price: 3.00, initial_stock: 100, mandatory: false },
    { item: 'VWLAY', price: 2.00, initial_stock: 100, mandatory: false },
    { item: 'VWGO', price: 8.00, initial_stock: 100, mandatory: false },
    { item: 'VWPLAY', price: 12.00, initial_stock: 100, mandatory: false },
  ]
});

const contract2 = new Contract({
  customer: customer2._id,
  machine: machine2._id,
  location: '41.8309248,2.1046689',
  startDate: new Date('2018-07-01'),
  endDate: new Date('2018-10-30'),
  saleCommission: 20,
  advCommission: 50,
  fixedFee: 0,
  currency: 'EUR',
  supplyContactName: 'Josep Bec Ari',
  supplyContactEmail: 'josep@becarios.com',
  supplyContactPhone: '+34 678123456',
  supplyShippingAddress: 'Av. Demo 34\n08080 Barcelona',
  items: [
    { item: 'VWPACK', price: 3.00, initial_stock: 100, mandatory: false },
    { item: 'VWLAY', price: 2.00, initial_stock: 100, mandatory: false },
    { item: 'VWGO', price: 8.00, initial_stock: 100, mandatory: false },
    { item: 'VWPLAY', price: 10.00, initial_stock: 100, mandatory: false },
  ]
});

// sales
const sale1 = new Sale({
  date: new Date(),
  machine: machine1._id,
  customer: customer1._id,
  contract: contract1._id,
  amount: 8.00,
  paymentMethod: 'CASH',
  code: 'X',
  items: [
    { item: 'VWPACK', price: 3.00, qty: 1 },
    { item: 'VWGO', price: 5.00, qty: 1 }
  ]
});

const sale2 = new Sale({
  date: new Date(),
  machine: machine1._id,
  customer: customer1._id,
  contract: contract1._id,
  amount: 3.00,
  paymentMethod: 'TPV',
  code: 'X',
  items: [
    { item: 'VWPACK', price: 3.00, qty: 1 }
  ]
});

const sale3 = new Sale({
  date: new Date(),
  machine: machine2._id,
  customer: customer2._id,
  contract: contract2._id,
  amount: 5.00,
  paymentMethod: 'TPV',
  code: 'X',
  items: [
    { item: 'VWPACK', price: 5.00, qty: 1 }
  ]
});

const incidence1 = new Incidence({
  machine: machine1._id,
  customer: customer1._id,
  description: 'This is a test description!',
  status: 'OPEN'
});

const incidence2 = new Incidence({
  machine: machine2._id,
  customer: customer2._id,
  description: 'This is a test description!',
  status: 'CLOSED'
});

const shipment1 = new Shipment({
  machine: machine1._id,
  customer: customer1._id,
  date: new Date(),
  items: {
    VWPACK: 100,
    VWLAY: 100,
    VWGO: 0,
    VWPLAY: 0
  },
  shipment_address: 'test'
})

const shipment2 = new Shipment({
  machine: machine2._id,
  customer: customer2._id,
  date: new Date(),
  items: {
    VWPACK: 100,
    VWLAY: 100,
    VWGO: 0,
    VWPLAY: 50
  },
  shipment_address: 'test'
})

// clear DB --------------------------------------------------------------------

IdentityCounter.remove()
.then(() => {
  return User.remove();
})
.then(() => {
  return Machine.remove();
})
.then(() => {
  return Incidence.remove();
})
.then(() => {
  return Sector.remove();
})
.then(() => {
  return Contract.remove();
})
.then(() => {
  return Sale.remove();
})
.then(() => {
  return Report.remove();
})
.then(() => {
  return Customer.remove();
})
.then(() => {
  return RemoteAction.remove();
})
.then(() => {
  return Shipment.remove();
})

// seed ------------------------------------------------------------------------

// insert sectors
.then(() => {
  console.log('Seeding Sectors...');

  return sectorAquaticParks.save()
  .then(() => {
    return sectorSpasWellness.save()
  });
})

// insert users
.then(() => {
  console.log('Seeding Users...');

  return userAdmin.save();
})

// insert reports
.then(() => {
  console.log('Seeding Reports...');

  return report1.save()
})

// insert customers
.then(() => {
  console.log('Seeding Customers...');

  return customer1.save()
  .then(() => {
    return customer2.save();
  })
})

// insert machines
.then(() => {
  console.log('Seeding Machines...');

  return machine1.save()
  .then(() => {
    return machine2.save();
  })
  .then(() => {
    return machine3.save();
  });
})

// insert contracts
.then(() => {
  console.log('Seeding Contracts...');

  return contract1.save()
  .then(() => {
    return contract2.save()
  });
})

// insert sales
.then(() => {
  console.log('Seeding Sales...');

  return sale1.save()
  .then(() => {
    return sale2.save();
  })
  .then(() => {
    return sale3.save();
  });
})

// insert incidences
.then(() => {
  console.log('Seeding Incidences...');

  return incidence1.save()
  .then(() => {
    return incidence2.save();
  });
})

// insert remote actions
.then(() => {
  console.log('Seeding Remote Actions...');

  return action1.save()
  .then(() => {
    return action2.save();
  });
})

// insert shipment
.then(() => {
  console.log('Seeding Shipments...');

  return shipment1.save()
  .then(() => {
    return shipment2.save();
  });
})

// finished
.then(() => {
  console.log('DB seeded!');
  mongoose.connection.close();
})
.catch(err => {
  console.log(err);
});
