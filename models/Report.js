const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');

const ReportSchema = new mongoose.Schema({

    start_date: {
        type: Date,
        required: [true, 'Can\'t be blank'],
    },
    finish_date: {
        type: Date,
        required: [true, 'Can\'t be blank'],
    },
    customer1: {
        type: String,
        ref: 'Customer',
        required: [true, 'Can\'t be blank']
    },
    customer1_start: {
        type: Number,
        required: [true, 'Can\'t be blank']
    },
    customer1_end: {
        type: Number,
        required: [true, 'Can\'t be blank']
    },
    customer2: {
        type: String,
        ref: 'Customer',
    },
    customer2_start: {
        type: Number,
        default: 0
    },
    customer2_end: {
        type: Number,
        default: 0
    },
    customer3: {
        type: String,
        ref: 'Customer',
    },
    customer3_start: {
        type: Number,
        default: 0
    },
    customer3_end: {
        type: Number,
        default: 0
    },
    customer4: {
        type: String,
        ref: 'Customer',
    },
    customer4_start: {
        type: Number,
        default: 0
    },
    customer4_end: {
        type: Number,
        default: 0
    },
    motive: {
        type: String,
        enum: ['Reparación', 'Entrega', 'Marqueting', 'Promotor','Reunión'],
        required: [true, 'Can\'t be blank']
    },
    personal1: {
        type: String,
        enum: ['Alex', 'Daniel', 'Javier', 'Joaquin'],
        required: [true, 'Can\'t be blank']
    },
    personal2: {
        type: String,
        enum: ['','Alex', 'Daniel', 'Javier', 'Joaquin']
    },
    personal3: {
        type: String,
        enum: ['','Alex', 'Daniel', 'Javier', 'Joaquin']
    },
    personal4: {
        type: String,
        enum: ['','Alex', 'Daniel', 'Javier', 'Joaquin']
    },
    coche_start: {
        type: Number,
        default: 0
    },
    coche_end: {
        type: Number,
        default: 0
    },
    hotel_price: {
        type: Number,
        default: 0
    },
    transporte: {
        type: String,
        enum: ['','Avion', 'Barco', 'Tren', 'Metro', 'Coche'],
    },
    transporte_price: {
        type: Number,
        default: 0
    },
    concept1: {
        type: String,
        default: ''
    },
    concept1_price: {
        type: Number,
        default: 0
    },
    concept2: {
        type: String,
        default: ''
    },
    concept2_price: {
        type: Number,
        default: 0
    },
    concept3: {
        type: String,
        default: ''
    },
    concept3_price: {
        type: Number,
        default: 0
    },
    concept4: {
        type: String,
        default: ''
    },
    concept4_price: {
        type: Number,
        default: 0
    },
    concept5: {
        type: String,
        default: ''
    },
    concept5_price: {
        type: Number,
        default: 0
    },
    description: {
        type: String,
        default: ''
    }
});

ReportSchema.plugin(autoIncrement.plugin, {
  model: 'Report',
  field: 'number',
  startAt: 1
});

mongoose.model('Report', ReportSchema);