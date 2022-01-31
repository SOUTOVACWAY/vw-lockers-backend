const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');

// setup connection to the development DB
if (process.env.NODE_ENV === 'production') {
  mongoose.connect(process.env.MONGODB_URI);
} else {
  mongoose.connect('mongodb://vacway-dev:vacway-dev@localhost/vacway-dev');
  mongoose.set('debug', true);
}

autoIncrement.initialize(mongoose.connection);
require('../models/Machine');
const Machine = mongoose.model('Machine');

Machine.find()
.then(machines => {
  machines.forEach(machine => {
    machine.bills_in_box.five = 0;
    machine.bills_in_box.ten = 0;
    machine.bills_in_box.twenty = 0;

    machine.cash_in_box.fifty = 0;
    machine.cash_in_box.one = 0;
    machine.cash_in_box.two = 0;
    machine.cash_in_box.token = 0;

    machine.cash_in_coiner.fifty = 0;
    machine.cash_in_coiner.one = 0;
    machine.cash_in_coiner.two = 0;

    return machine.save();
  })
})
.catch(err => {
  console.log(err);
});

