const mongoose = require('mongoose');


const RemoteActionSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: [true, 'Can\'t be blank']
  },
  machine: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Machine',
    required: [true, 'Can\'t be blank']
  },
  code: {
    type: String,
    enum: ['COMMAND', 'COVER_OPEN', 'COVER_CLOSE', 'WATERPROOF',
           'EXPEDIT_VWPACK', 'EXPEDIT_VWLAY', 'EXPEDIT_VWGO', 'EXPEDIT_VWPLAY',
           'UPDATE', 'REBOOT', 'TEST_SUCC', 'HARD_RESET', 'DOOR_OPEN',
           'BOARD_A_CMD', 'BOARD_B_CMD'],
    required: [true, 'Can\'t be blank']
  },
  arguments: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    enum: ['PENDING', 'COMPLETE', 'ERROR'],
    required: [true, 'Can\'t be blank']
  },
  result: {
    type: String,
    default: ''
  }
});

mongoose.model('RemoteAction', RemoteActionSchema);

