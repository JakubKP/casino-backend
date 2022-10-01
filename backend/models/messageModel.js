const mongoose = require('mongoose')

const MessageSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    userName: {
        type: String,
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
    hour: {
        type: String,
        required: true
    }
},
{
    timestamps: true,
})

module.exports = mongoose.model('Message', MessageSchema)