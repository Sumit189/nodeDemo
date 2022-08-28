const mongoose = require('mongoose');
const questions = mongoose.model('questions', {
    ques_id:{
        type: Number,
        required: true,
    },
    content: {
        type: String,
        required: true
    },
    input_type: {
        type: String,
        required: true
    }

})

module.exports = questions