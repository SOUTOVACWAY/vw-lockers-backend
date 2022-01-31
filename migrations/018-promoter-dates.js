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
    machine.promoter_report_from_day = 26;
    machine.promoter_report_to_day = 25;

    return machine.save();
  })
})
.catch(err => {
  console.log(err);
});



