const express = require('express')
const router = express.Router()
const rateLimit = require('express-rate-limit')
const {
    registerUser,
    loginUser,
    isLogged,
    logoutUser,
} = require('../controllers/userController')

const loginLimiter = rateLimit({
    max: 9,
    windowMs: 60 * 1000 * 10,
    statusCode: 429,
    message: {
        message: 'Too many login requests try in 10 minutes'
       }
})

const registerLimiter = rateLimit({
    max: 6,
    windowMs: 60 * 1000 * 60 * 24,
    statusCode: 429,
    message: {
        message: 'Too many register requests today'
       }
})

router.post('/', registerLimiter, registerUser)
router.post('/login', loginLimiter, loginUser)
router.get('/islogged', isLogged)
router.get('/logout', logoutUser)


module.exports = router