const asyncHandler = require('express-async-handler')
const Bet = require('../models/betModel')
const User = require('../models/userModel')

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

        if(bets) {
            res.status(201)
                .json(bets)
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
}