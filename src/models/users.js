const mongoose = require('mongoose');
const users = mongoose.model('users', {
    username: { 
        type: String, 
        required: true, 
        unique: true 
    },
    password: {
        type: String,
        required: true
    }
})

module.exports = users