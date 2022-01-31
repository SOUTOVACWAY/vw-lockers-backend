const mongoose = require('mongoose');

const SectorSchema = new mongoose.Schema({
  description: {
    type: String,
    required: [true, 'Can\'t be blank']
  }
});

mongoose.model('Sector', SectorSchema);
