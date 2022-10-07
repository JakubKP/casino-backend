const Message = require('../models/messageModel')
const asyncHandler = require('express-async-handler')

// @desc Send message
// @route POST /api/messages/send
// @access Private
const sendMessage = asyncHandler(async (req, res) => {
    try {
        const io = req.app.get("io");

        const { message } = req.body

        if(message.length > 42) {
            return res.status(400).json({
                message: 'Message is too long'
            }).send()
        }

        if(typeof(message) !== 'string') {
            return res.status(400).json({
                message: 'Bad message type'
            }).send()
        }

        const date = new Date()
        const time = `
         ${date.getHours() < 10 ? '0' + String(date.getHours()) : date.getHours()}:${date.getMinutes() < 10 ? '0' + String(date.getMinutes()) : date.getMinutes()}:${date.getSeconds() < 10 ? '0' + String(date.getSeconds()) : date.getSeconds()}`

        const createMessage = await Message.create({
            user: req.user.id,
            userName: req.user.name,
            message,
            hour: time,
        })

        if(createMessage) {
            io.emit('receive_message', { message, userName: req.user.name, hour: time})
            res.status(201)
                .send()
        }

    } catch (error) {
        console.log(error)
        res.status(404)
                .send()
    }
})

// @desc Get messages
// @route GET /api/messages/get
// @access Public
const getMessages = asyncHandler(async (req, res) => {

    try {

        const lastMessages = await (await Message.find().sort({_id: -1}).limit(20).select('userName message hour -_id')).reverse()

        if(lastMessages) {
            res.status(201)
                .json({
                    lastMessages
                })
                .send()
        }   
    } catch (error) {
        console.log(error)
    }
})

module.exports = {
    sendMessage,
    getMessages,
}