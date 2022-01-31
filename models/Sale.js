const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');

const SaleSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: [true, 'Can\'t be blank']
  },
  machine: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Machine',
    required: [true, 'Can\'t be blank']
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
    required: [true, 'Can\'t be blank']
  },
  contract: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Contract',
    required: [true, 'Can\'t be blank']
  },
  items: [{
    price: Number,
    qty: Number,
    item: {
      type: String,
      required: [true, 'Can\'t be blank']
    }
  }],
  amount: {
    type: Number,
    required: [true, 'Can\'t be blank']
  },
  paymentMethod: {
    type: String,
    enum: ['CASH', 'TPV', 'TOKEN'],
    required: [true, 'Can\'t be blank']
  },
  code: {
    type: String,
    required: [true, 'Can\'t be blank']
  },
  origin: {
    type: String,
    default: ''
  },
  details: {
    type: String,
    default: ''
  }
});

SaleSchema.plugin(autoIncrement.plugin, {
  model: 'Sale',
  field: 'number',
  startAt: 1
});

mongoose.model('Sale', SaleSchema);


