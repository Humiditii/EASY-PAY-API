const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const adminPaymentSchema = new Schema ({
    receiverName: {
        type: String,
        required: true
    },
    
    receiverId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    amount: {
        type: Number,
        required: true
    },

    adminId: {
        type: Schema.Types.ObjectId,
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


module.exports = mongoose.model('AdminPayment', adminPaymentSchema);