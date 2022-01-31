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
    machine.token_sale_value = machine.token_value

    return machine.save();
  })
})
.catch(err => {
  console.log(err);
});
