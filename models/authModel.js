const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const signUpSchema = new Schema({
    name: {
        type: String,
        required: true,

    }, 
    email: {
        type: String,
        required: true
    },
    phone: {
        type: Number,
        required: true
    },
    role: {
        type: String,
        required: true
    },
    pin: {
        type: String,
        required: true
    },

    adminId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        
    },

    password: {
        type: String,
        require: true
    }
}); 

module.exports = mongoose.model('Signup', signUpSchema);


