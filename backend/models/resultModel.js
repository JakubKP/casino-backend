const mongoose = require('mongoose')

const resultSchema = mongoose.Schema({
    drawNumber: {
        type: Number,
        required: true,
    },
    result: {
        type: String,
        required: true,
    }
},
{
    timestamps: true,
})

module.exports = mongoose.model('Result', resultSchema)