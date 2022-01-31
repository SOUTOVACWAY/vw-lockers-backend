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
const Report = mongoose.model('Report');
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
  email: 'gmarull@vacway.es',
  fullname: 'Gerard Marull Paretas',
  type: 'ROOT'
});

userAdmin.setPassword('ZJHNPxnAG2XJd32e');

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
  email: 'info@vacway.es',
  fullname: 'Vacway Waterproof S.L.',
  address: 'C/ Vallespir 67 (local)\n08014 Barcelona',
  phone: '+34 931 462 245',
  sector: sectorAquaticParks._id,
  invoice_taxid: '',
  invoice_address: 'C/ Vallespir 67 (local)\n08014 Barcelona'
});

customer1.setPassword('G3hnjQBd3PZfwFxp');

// machines
const machine1 = new Machine({
  type: 'VACWAYone',
  build_date: Date.now(),
  last_signal: Date.now(),
  tpv_serial: '41100096',
  tpv_tcod: '',
  tpv_max: 20
});

const machine2 = new Machine({
  type: 'VACWAYone',
  build_date: Date.now()
});

// contracts
const contract1 = new Contract({
  customer: customer1._id,
  machine: machine1._id,
  location: '41.3801871,2.1342636',
  startDate: new Date('2018-05-01'),
  endDate: new Date('2019-05-01'),
  saleCommission: 0,
  advCommission: 0,
  fixedFee: 0,
  currency: 'EUR',
  supplyContactName: 'Xavier Rocamora',
  supplyContactEmail: 'xrocamora@vacway.es',
  supplyContactPhone: '',
  supplyShippingAddress: 'C/ Vallespir 67 (local)\n08014 Barcelona',
  items: [
    { item: 'VWPACK', price: 1.00, initial_stock: 100, mandatory: false },
    { item: 'VWLAY', price: 1.00, initial_stock: 100, mandatory: false },
    { item: 'VWGO', price: 1.00, initial_stock: 100, mandatory: false },
    { item: 'VWPLAY', price: 1.00, initial_stock: 100, mandatory: false },
  ]
});

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
})

// insert machines
.then(() => {
  console.log('Seeding Machines...');

  return machine1.save()
  .then(() => {
    return machine2.save();
  })
})

// insert contracts
.then(() => {
  console.log('Seeding Contracts...');

  return contract1.save()
})

// finished
.then(() => {
  console.log('DB seeded!');
  mongoose.connection.close();
})
.catch(err => {
  console.log(err);
});
