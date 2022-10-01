const express = require('express')
const router = express.Router()
const { protect } = require('../middleware/authMiddleware')
const rateLimit = require('express-rate-limit')
const {
    makeBet,
    getCoins,
    getBets,
} = require('../controllers/betController')

const betLimiter = rateLimit({
    max: 6,
    windowMs: 30 * 1000,
    statusCode: 429,
    message: {
        message: 'Too much bets'
       }
})

router.post('/bet', protect, betLimiter, makeBet)
router.get('/getcoins', protect, getCoins)
router.get('/getbets', getBets)

module.exports = router