const express = require('express')
const router = express.Router()
const { protect } = require('../middleware/authMiddleware')
const rateLimit = require('express-rate-limit')
const {
    makeBet,
    getCoins,
    getBets,
    freeCoins,
} = require('../controllers/betController')

const betLimiter = rateLimit({
    max: 1,
    windowMs: 1 * 500,
    statusCode: 429,
    message: {
        message: 'Too much bets'
       }
})

router.post('/bet', protect, betLimiter, makeBet)
router.get('/getcoins', protect, getCoins)
router.get('/getbets', getBets)
router.post('/freecoins', protect, freeCoins)

module.exports = router