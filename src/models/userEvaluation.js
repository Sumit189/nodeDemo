const mongoose = require('mongoose');
const UserEvaluations = mongoose.model('UserEvaluations',{
    userid:{
        type: String,
        required: true
    },
    question:{
        type: Number,
        required: true,
    },
    answer:{
        type: String,
        required: true,
    }
})

module.exports = UserEvaluations