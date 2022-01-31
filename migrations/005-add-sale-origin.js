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
require('../models/Sale');
const Sale = mongoose.model('Sale');

Sale.find()
.then(sales => {
  sales.forEach(sale => {
    sale.origin = ''

    return sale.save();
  })
})
.catch(err => {
  console.log(err);
});
