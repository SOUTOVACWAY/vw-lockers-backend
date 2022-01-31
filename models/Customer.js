const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const secret = require('../config').secret;
const autoIncrement = require('mongoose-auto-increment');

const CustomerSchema = new mongoose.Schema({
  email: {
    type: String,
    lowercase: true,
    unique: true,
    required: [true, 'Can\'t be blank'],
    match: [/\S+@\S+\.\S+/, 'Is invalid'],
    index: true
  },
  hash: String,
  salt: String,
  fullname: {
    type: String,
    required: [true, 'Can\'t be blank']
  },
  address: {
    type: String,
    default: ''
  },
  contact_person: {
    type: String,
    default: ''
  },
  phone: {
    type: String,
    default: ''
  },
  phone2: {
    type: String,
    default: ''
  },
  fax: {
    type: String,
    default: ''
  },
  web: {
    type: String,
    default: ''
  },
  language: {
    type: String,
    default: ''
  },
  notes: {
    type: String,
    default: ''
  },
  sector: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Sector'
  },
  social_name: {
    type: String,
    default: ''
  },
  invoice_taxid: {
    type: String,
    default: ''
  },
  invoice_address: {
    type: String,
    default: ''
  },
  invoice_tax: {
    type: Number,
    default: 0
  },
  stock: {
    VWPACK: {type: Number, default: 0},
    VWLAY: {type: Number, default: 0},
    VWGO: {type: Number, default: 0},
    VWPLAY: {type: Number, default: 0},
  },
});

CustomerSchema.plugin(uniqueValidator, {message: 'Is already taken.'});

CustomerSchema.plugin(autoIncrement.plugin, {
  model: 'Customer',
  field: 'number',
  startAt: 1
});

CustomerSchema.methods.validPassword = function(password) {
  const hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
  return this.hash === hash;
};

CustomerSchema.methods.setPassword = function(password) {
  this.salt = crypto.randomBytes(16).toString('hex');
  this.hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
};

CustomerSchema.methods.generateJWT = function() {
  const today = new Date();
  const exp = new Date(today);
  exp.setDate(today.getDate() + 60);

  return jwt.sign({
    id: this._id,
    fullname: this.fullname,
    role: 'CUSTOMER',
    type: '',
    exp: parseInt(exp.getTime() / 1000),
  }, secret);
};

CustomerSchema.methods.toAuthJSON = function() {
  return {
    email: this.email,
    token: this.generateJWT(),
  };
};

mongoose.model('Customer', CustomerSchema);
