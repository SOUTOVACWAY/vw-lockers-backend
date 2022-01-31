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
    machine.night_mode_start = 21;
    machine.night_mode_end = 8;

    return machine.save();
  })
})
.catch(err => {
  console.log(err);
});
