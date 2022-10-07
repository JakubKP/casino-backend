const asyncHandler = require('express-async-handler')
const Bet = require('../models/betModel')
const User = require('../models/userModel')
const Result = require('../models/resultModel')

// @desc Make bet
// @route POST /api/bets/bet
// @access Private
const makeBet = asyncHandler(async (req, res) => {
    try {
        const io = req.app.get("io");

        const { betAmount, betType } = req.body

        let black = red = green = 0

        if(betType === 'red') {
            red = betAmount
        } else if (betType === 'black') {
            black = betAmount
        } else if (betType ==='green') {
            green = betAmount
        }

        if(typeof(betAmount) !== 'number') {
            return res.status(400).json({
                message: 'Bad amount type, only integers'
            }).send()
        }

        if(betType !== 'red' && betType !== 'green' && betType !== 'black' ) {
            return res.status(400).json({
                message: 'Wrong bet type'
            }).send()
        }

        if(typeof(betType) !== 'string') {
            return res.status(400).json({
                message: 'Bad bet type'
            }).send()
        }
        
        if(betAmount < 1) {
            return res.status(400).json({
                message: 'Minimum bet is 1 coin'
            }).send()
        }
        if(betAmount > req.user.coins) {
            return res.status(400).json({
                message: "You dont have that many coins",
            }).send()
        }

        const subtractCoins = await User.findByIdAndUpdate(req.user._id, { 
            coins: req.user.coins - betAmount
        })

        if(subtractCoins) {
            const bet = await Bet.create({
                user: req.user.id,
                userName: req.user.name,
                bet: betAmount,
                type: betType,
                betId: global.spinNumber
            })

            if(bet) {
                io.emit('send_bet', {
                    userName: req.user.name,
                    bet: betAmount,
                    type: betType,
                })
                res.status(201)
                .json({
                    black,
                    red,
                    green,
                    coins: req.user.coins - betAmount,
                    message: 'Success!',
                })
                .send()
            }
        }

    } catch (error) {
        console.log(error)
    }
})

// @desc    Get coins amount
// @route   GET /api/bets/getcoins
// @access  Private
const getCoins = asyncHandler(async (req, res) => {

    try {
        
        let black = red = green = 0

        const betsValue = await Bet.find({
            user: req.user._id,
            betId: global.spinNumber
        })

        if(betsValue) {

            betsValue.forEach(bet => {
                if(bet.type === 'green') {
                    green += bet.bet
                } else if (bet.type === 'red') {
                    red += bet.bet
                } else if (bet.type === 'black') {
                    black += bet.bet
                }
            })

            res.status(201)
                .json({
                    black,
                    red,
                    green,
                    coins: req.user.coins
                })
                .send()
        }

    } catch (error) {
        console.log(error)
    }
})

// @desc    Get bets
// @route   GET /api/bets/getbets
// @access  Public
const getBets = asyncHandler(async (req, res) => {
    try {

        const bets = await Bet.find({
            betId: global.spinNumber,
        }).select('userName bet type')

        const betsHistory = await Result.find().sort({_id: -1}).select('result -_id').limit(100)

        if(bets && betsHistory) {
            res.status(201)
                .json({
                    bets,
                    betsHistory,
                })
                .send()
        }  

    } catch (error) {
        console.log(error)
    }
})

// @desc    Free coins
// @route   POST /api/bets/freecoins
// @access  Private
const freeCoins = asyncHandler(async (req, res) => {

    try {

        function convertMsToHM(milliseconds) {
            let seconds = Math.floor(milliseconds / 1000);
            let minutes = Math.floor(seconds / 60);
            let hours = Math.floor(minutes / 60);
          
            seconds = seconds % 60;
            // 👇️ if seconds are greater than 30, round minutes up (optional)
            minutes = seconds >= 30 ? minutes + 1 : minutes;
          
            minutes = minutes % 60;
          
            // 👇️ If you don't want to roll hours over, e.g. 24 to 00
            // 👇️ comment (or remove) the line below
            // commenting next line gets you `24:00:00` instead of `00:00:00`
            // or `36:15:31` instead of `12:15:31`, etc.
            hours = hours % 24;
          
            return `${minutes}`;
          }

        if((Date.now() - req.user.bonusClaim) < 1000 * 60 * 30) {
            let timeLeft = convertMsToHM(Date.now() - req.user.bonusClaim)
            return res.status(400)
                .json({
                message: `Next claim available in ${30 - timeLeft} minutes`,
                })
                .send()
       }

       const coinsAfterAdd = req.user.coins + 1000000
       const addFreeCoins = await User.findByIdAndUpdate(req.user._id, {
           coins: coinsAfterAdd,
           bonusClaim: Date.now(),
       })

       if(addFreeCoins) {
           res.status(201)
               .json({
                   coinsAfterAdd,
                   message: 'You got free coins!',
               })
               .send()
       }     
    } catch (error) {
        console.log(error)
    }
})

module.exports = {
    makeBet,
    getCoins,
    getBets,
    freeCoins,
}