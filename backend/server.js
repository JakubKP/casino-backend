const express = require('express')
const app = express()
const dotenv = require('dotenv').config()
const cors = require('cors')
const port = process.env.PORT || 5000
const { Server } = require('socket.io')

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false}))

const server = app.listen(port, () => {
    console.log(`Server started on port ${port}`)
})

const io = new Server(server, {
    cors: {
        origin: '*'
    }
})

const ws = io.on('connection', (socket) => {
    console.log(`User connected ${socket.id}`)
})