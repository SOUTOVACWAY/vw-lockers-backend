const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');

const IncidenceSchema = new mongoose.Schema({
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
  description: {
    type: String,
    required: [true, 'Can\'t be blank']
  },
  status: {
    type: String,
    enum: ['OPEN', 'CLOSED'],
    default: 'OPEN'
  }
}, { timestamps: { createdAt: 'createdAt' } });

IncidenceSchema.plugin(autoIncrement.plugin, {
  model: 'Incidence',
  field: 'number',
  startAt: 1
});

mongoose.model('Incidence', IncidenceSchema);
