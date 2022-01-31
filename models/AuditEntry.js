const mongoose = require('mongoose');

const AuditEntrySchema = new mongoose.Schema({
  date: {
    type: Date,
    required: [true, 'Can\'t be blank']
  },
  machine: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Machine',
    required: [true, 'Can\'t be blank']
  },
  type: {
    type: String,
    enum: ['INFO', 'WARNING', 'ERROR', 'MONEY', 'CHANGE'],
    required: [true, 'Can\'t be blank']
  },
  description: {
    type: String,
    required: [true, 'Can\'t be blank']
  }
});

mongoose.model('AuditEntry', AuditEntrySchema);
