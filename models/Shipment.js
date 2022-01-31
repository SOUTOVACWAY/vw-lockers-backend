const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');

const ShipmentSchema = new mongoose.Schema({
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
    required: [true, 'Can\'t be blank']
  },
  date: {
    type: Date,
    required: [true, 'Can\'t be blank']
  },
  shipment_address: {
    type: String,
    required: [true, 'Can\'t be blank']
  },
  items: {
    VWPACK: {type: Number, default: 0},
    VWLAY: {type: Number, default: 0},
    VWGO: {type: Number, default: 0},
    VWPLAY: {type: Number, default: 0},
  }
}, { timestamps: true });

ShipmentSchema.plugin(autoIncrement.plugin, {
  model: 'Shipment',
  field: 'number',
  startAt: 1
});

mongoose.model('Shipment', ShipmentSchema);
