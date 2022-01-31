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
require('../models/Customer');
const Customer = mongoose.model('Customer');

Customer.find()
.then(customers => {
  customers.forEach(customer => {
    customer.contact_person = '';
    customer.phone2 = '';
    customer.fax = '';
    customer.web = '';
    customer.language = '';
    customer.notes = '';
    customer.social_name = '';
    customer.invoice_tax = 0;

    return customer.save();
  })
})
.catch(err => {
  console.log(err);
});
