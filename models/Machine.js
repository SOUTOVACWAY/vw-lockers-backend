const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');
const uniqueValidator = require('mongoose-unique-validator');
const crypto = require('crypto');

const MachineSchema = new mongoose.Schema({
  serial: {
    type: 'String',
    required: [true, 'Can\'t be blank'],
    unique: true
  },
  type: {
    type: String,
    enum: ['VACWAYmini', 'VACWAYone'],
    required: [true, 'Can\'t be blank']
  },
  token: {
    type: String,
    required: [true, 'Can\'t be blank'],
    unique: true
  },
  build_date: {
    type: Date,
    required: [true, 'Can\'t be blank'],
  },
  comments: {
    type: String,
    default: ''
  },
  contract: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Contract'
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer'
  },
  location: {
    type: String,
    default: ''
  },
  last_signal: {
    type: Date,
    default: new Date('1970-01-01')
  },
  sw_version: {
    type: String,
    default: ''
  },
  fw_version: {
    type: String,
    default: ''
  },
  tpv_serial: {
    type: String,
    default: ''
  },
  tpv_tcod: {
    type: String,
    default: ''
  },
  tpv_max: {
    type: Number,
    default: 20
  },
  cash_in_box: {
    type: Number,
    default: 0
  },
  stock_machine: {
    VWPACK: {type: Number, default: 0},
    VWLAY: {type: Number, default: 0},
    VWGO: {type: Number, default: 0},
    VWPLAY: {type: Number, default: 0},
  },
  stock_estimated: {
    VWPACK: {type: Number, default: 0},
    VWLAY: {type: Number, default: 0},
    VWGO: {type: Number, default: 0},
    VWPLAY: {type: Number, default: 0},
  },
  pin: {
    type: Number,
    required: [true, 'Can\'t be blank']
  },
  sound_interval: {
    type: Number,
    required: [true, 'Can\'t be blank']
  },
  bills_in_box: {
    five: {type: Number, default: 0},
    ten: {type: Number, default: 0},
    twenty: {type: Number, default: 0}
  },
  cash_in_box: {
    fifty: {type: Number, default: 0},
    one: {type: Number, default: 0},
    two: {type: Number, default: 0},
    token: {type: Number, default: 0}
  },
  cash_in_coiner: {
    fifty: {type: Number, default: 0},
    one: {type: Number, default: 0},
    two: {type: Number, default: 0},
  },
  status : {
    type: String,
    enum: ['OPERATIVE', 'SLEEP', 'OUT_OF_SERVICE', 'MAINTENANCE'],
    default: 'OPERATIVE'
  },
  night_mode_start: {
    type: Number,
    required: [true, 'Can\'t be blank']
  },
  night_mode_end: {
    type: Number,
    required: [true, 'Can\'t be blank']
  },
  token_value: {
    type: Number,
    required: [true, 'Can\'t be blank']
  },
  token_sale_value: {
    type: Number,
    required: [true, 'Can\'t be blank']
  },
  report_email: {
    type: String
  },
  reset_no_internet: {
    type: Boolean,
    required: [true, 'Can\'t be blank']
  },
  bubbles_intensity: {
    type: Number,
    required: [true, 'Can\'t be blank'],
    min: 0,
    max: 100
  },
  enable_standby: {
    type: Boolean,
    required: [true, 'Can\'t be blank']
  },
  promoter_fees: {
    VWPACK: {type: Number, default: 0},
    VWLAY: {type: Number, default: 0},
    VWGO: {type: Number, default: 0},
  },
  shift_active: {
    type: Boolean,
    default: false
  },
  has_promoter: {
    type: Boolean,
    required: [true, 'Can\'t be blank']
  },
  promoter_report_from_day: {
    type: Date,
    required: [true, 'Can\'t be blank']
  },
  promoter_report_to_day: {
    type: Date,
    required: [true, 'Can\'t be blank']
  }
});

MachineSchema.plugin(uniqueValidator);

MachineSchema.plugin(autoIncrement.plugin, {
  model: 'Machine',
  field: 'number',
  startAt: 1
});

MachineSchema.pre('validate', function(next) {
  let machine = this;

  if (machine.serial) return next();

  machine.nextCount(function(err, count) {
    if (err) return next(err);

    // assign automatic serial number
    let number = `000000${count}`;
    number = number.substr(number.length - 6);
    machine.serial = `VWM${number}`;

    // assign token
    machine.token = crypto.randomBytes(8).toString('hex');

    // assign pin
    machine.pin = Math.floor(100000 + Math.random() * 900000);

    next();
  })
});

mongoose.model('Machine', MachineSchema);
