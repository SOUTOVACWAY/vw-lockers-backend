const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const secret = require('../config').secret;
const autoIncrement = require('mongoose-auto-increment');

const UserSchema = new mongoose.Schema({
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
  type: {
    type: String,
    enum: ['ROOT', 'LIMITED'],
    required: [true, 'Can\'t be blank']
  }
});

UserSchema.plugin(uniqueValidator, {message: 'Is already taken.'});

UserSchema.plugin(autoIncrement.plugin, {
  model: 'User',
  field: 'number',
  startAt: 1
});

UserSchema.methods.validPassword = function(password) {
  const hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
  return this.hash === hash;
};

UserSchema.methods.setPassword = function(password) {
  this.salt = crypto.randomBytes(16).toString('hex');
  this.hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
};

UserSchema.methods.generateJWT = function() {
  const today = new Date();
  const exp = new Date(today);
  exp.setDate(today.getDate() + 60);

  return jwt.sign({
    id: this._id,
    username: this.username,
    fullname: this.fullname,
    role: 'ADMIN',
    type: this.type,
    exp: parseInt(exp.getTime() / 1000),
  }, secret);
};

UserSchema.methods.toAuthJSON = function() {
  return {
    email: this.email,
    token: this.generateJWT(),
  };
};

mongoose.model('User', UserSchema);
