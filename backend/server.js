const express = require('express')
const app = express()
const cookieParser = require('cookie-parser')
const dotenv = require('dotenv').config()
const cors = require('cors')
const { Server } = require('socket.io')
const connectDB = require('./config/db')
const Result = require('./models/resultModel')
const Bets = require('./models/betModel')
const User = require('./models/userModel')
const { errorHandler } = require('./middleware/errorMiddleware')
const port = process.env.PORT || 5000


connectDB()

app.use(cors({ credentials: true, origin: ['http://localhost:3000'] }))
app.use(express.json())
app.use(express.urlencoded({ extended: false}))
app.use(cookieParser())

app.use('/api/users', require('./routes/userRoutes'))
app.use('/api/bets', require('./routes/betRoutes'))
app.use('/api/messages', require('./routes/messagesRoutes'))


app.use(errorHandler)

const server = app.listen(port, () => {
    console.log(`Server started on port ${port}`)
})

const io = new Server(server, {
    cors: {
        origin: 'http://localhost:3000'
    }
})

global.spinNumber = 0
global.timeToSpin = 30

const ws = io.on('connection', (socket) => {
    console.log(`User connected ${socket.id}`)
    app.set("io", io);

    socket.on('send_message', (data) => {
        io.emit('receive_message', data)
    })

})

setInterval(async () => {
    timeToSpin--
    ws.emit('send_timer', { timeToSpin })
    if(timeToSpin === 0) {
        timeToSpin = 30
        function getWinners(min, max) {
            min = Math.ceil(min);
            max = Math.floor(max);
            const number = Math.floor(Math.random() * (max - min) + min); 
            if(number == 1) {
                return 'green'
            } else if (number > 1 && number <= 7) {
                return 'red'
            } else if (number > 7 && number < 16) {
                return 'black'
            }
          }
    
          function wheelPosition (color) {
            if(color == 'green') {
                const casesGreen = ['8200', '8274', '8234', '8193']
                return casesGreen[Math.floor(Math.random()*4)]
            } else if (color == 'red') {
                const casesRed = ['8393', '8620', '8180', '7740']
                return casesRed[Math.floor(Math.random()*4)]
            } else if (color == 'black') {
                const casesBlack = ['8474', '8730', '8030', '9074']
                return casesBlack[Math.floor(Math.random()*4)]
            }
        }
    
        let random = getWinners(1,16)
        let position = wheelPosition(random)

        const Results = Result.create({
            result: random,
            drawNumber: spinNumber,
        })
    
        if(Results) {
               const winBets = await Bets.find({
                    type: random,
                    betId: spinNumber,
               })
    
               if(winBets) {
                const uniqueIds = []
                const winners = winBets.filter(win => {
                    const isDuplicate = uniqueIds.includes(String(win.user));
    
                    if (!isDuplicate) {
                      uniqueIds.push(String(win.user));
                  
                      return true;
                    }
                  
                    return false;
                })
    
                winners.forEach(async (winner) => {
                    let coinsPayout = 0
                    
                    winBets.forEach((bet) => {
                        if(String(winner.user) === String(bet.user)) {
                            coinsPayout = coinsPayout + bet.bet
                        }
                    })
    
                    const user = await User.findById(winner.user)
    
                    if(user) {
                        let multipler = 2
                        if(random === 'green') multipler = 14
    
                        await User.findByIdAndUpdate(winner.user, {
                            coins: user.coins + (coinsPayout * multipler)
                        })
                    }
                })
                ws.emit('send_draw', { position })
                spinNumber++
            }
        }
     }
}, 1000) 