const mongoose = require('mongoose')

const betSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    userName: {
        type: String,
        required: true,
    },
    bet: {
        type: Number,
        required: true,
    },
    type: {
        type: String,
        required: true,
    },
    betId: {
        type: Number,
        required: true,
    },
},
{
    timestamps: true,
})

module.exports = mongoose.model('Bet', betSchema)