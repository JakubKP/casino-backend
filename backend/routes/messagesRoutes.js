const express = require('express')
const router = express.Router()
const { protect } = require('../middleware/authMiddleware')
const rateLimit = require('express-rate-limit')
const {
    sendMessage,
    getMessages,
} = require('../controllers/messageController')

const messageLimiter = rateLimit({
    max: 1,
    windowMs: 5 * 1000,
    statusCode: 429,
    message: {
        message: 'One message per 5 seconds'
       }
})



router.post('/send', protect, messageLimiter, sendMessage)
router.get('/get', getMessages)

module.exports = router