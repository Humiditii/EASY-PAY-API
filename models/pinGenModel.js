const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const pinGenerateSchema = new Schema ({
    name: {
        type: String,
        required:true
    },
    pin: {
        type: String,
        required: true
    },
    status: {
        type: Number,
        required: true
    },
    adminId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }

});

module.exports = mongoose.model('PinGen', pinGenerateSchema);