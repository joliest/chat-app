const express = require('express')
const path = require('path')
const http = require('http')
const socketio = require('socket.io')
const Filter = require('bad-words')

const app = express()
const server = http.createServer(app)
const io = socketio(server)

const PORT = process.env.PORT || 3000

const PUBLIC_FOLDER = path.join(__dirname, '../public')
app.use(express.static(PUBLIC_FOLDER))


io.on('connection', (socket) => {
    console.log('New Websocket Connection')
    socket.emit('message', 'Welcome!')
    socket.broadcast.emit('message', 'A new user has joined')

    socket.on('sendMessage', (message, callback) => {
        const filter = new Filter()

        if (filter.isProfane(message)) {
            return callback('Profanity is not tolerated')
        }

        io.emit('message', message)
        callback() // calls the acknowledgement
    })

    socket.on('sendLocation', (coords, callback) => {
        if (!coords) {
            return false;
        }

        io.emit('locationMessage', `https://maps.google.com/maps?q=${coords.latitude},${coords.longitude}`)
        callback(true)
    })

    socket.on('disconnect', () => {
        io.emit('message', 'A user has left')
    })
})

server.listen(PORT, () => {
    console.log(`listening to ${PORT}`)
})