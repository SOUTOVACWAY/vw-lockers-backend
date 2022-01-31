const mongoose = require('mongoose');

const PromoterSaleSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: [true, 'Can\'t be blank']
  },
  machine: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Machine',
    required: [true, 'Can\'t be blank']
  },
  items: [{
    fee: Number,
    item: {
      type: String,
      enum: ['VWPACK', 'VWLAY', 'VWGO'],
      required: [true, 'Can\'t be blank']
    }
  }]
});

mongoose.model('PromoterSale', PromoterSaleSchema);
