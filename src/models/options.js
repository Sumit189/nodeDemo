const mongoose = require('mongoose');
const options = mongoose.model('options', {
    ques_id:{
        type: Number,
        required: true,
    },
    option_id: {
        type: Number,
        required: true
    },
    content: {
        type: String,
        required: true
    }
})

module.exports = options