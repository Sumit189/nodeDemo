const mongoose = require('mongoose');
const UserEvaluations = mongoose.model('UserEvaluations',{
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