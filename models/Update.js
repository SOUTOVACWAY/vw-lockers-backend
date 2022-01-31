const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');


const UpdateSchema = new mongoose.Schema({
  version: {
    type: String,
    unique: true,
    match: [/([0-9]+)\.([0-9]+)\.([0-9]+)/, 'is invalid'],
    required: [true, 'Can\'t be blank']
  },
  download_url: {
    type: String,
    required: [true, 'Can\'t be blank']
  },
  applies_to: {
    type: String,
    default: ''
  }
});

UpdateSchema.plugin(uniqueValidator, {message: 'Already registered.'});

mongoose.model('Update', UpdateSchema);

