const mongoose = require('mongoose');

const ShiftEntrySchema = new mongoose.Schema({
  machine: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Machine',
    required: [true, 'Can\'t be blank']
  },
  date: {
    type: Date,
    required: [true, 'Can\'t be blank']
  },
  action: {
    type: String,
    enum: ['START', 'STOP', 'STOP_AUTO'],
    required: [true, 'Can\'t be blank']
  }
});

mongoose.model('ShiftEntry', ShiftEntrySchema);