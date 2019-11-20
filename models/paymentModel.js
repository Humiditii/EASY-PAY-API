const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const paymentSchema = new Schema({

    admin: {
        type: String,
        required: true,
    },
    adminId : {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    depositorId : { 
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    depositor: {
        type: String,
        required: true,
    },
    
    amount: {
        type: Number,
        required: true
    },

    status: {
        type: Number,
        required: true
    },

    time: {
        type: String,
        required: true
    },

    month: {
        type: Number,
        required: true
    },

    day: {
        type: Number,
        required: true
    }, 
    
    year: {
        type: Number,
        required: true
    },

    date: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Payment', paymentSchema);

