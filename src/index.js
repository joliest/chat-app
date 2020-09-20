const express = require('express')
const path = require('path')
const http = require('http')
const socketio = require('socket.io')
const Filter = require('bad-words')
const { generateMessage, generateLocationMessage } = require('./utils/messages')
const {
    addUser,
    removeUser,
    getUser,
    getUserInRoom
} = require('./utils/users')

const app = express()
const server = http.createServer(app)
const io = socketio(server)

const PORT = process.env.PORT || 3000

const PUBLIC_FOLDER = path.join(__dirname, '../public')
app.use(express.static(PUBLIC_FOLDER))

const ADMIN = 'Admin'

io.on('connection', (socket) => {
    console.log('New Websocket Connection')
    socket.on('join', (options, callback) => {
        // track user
        const { error, user } = addUser({ id: socket.id,...options })

        if (error) {
            return callback(error)
        }
        

        // allows to join a room
        socket.join(user.room)

        socket.emit('message', generateMessage(ADMIN, 'Welcome!'))
        // broadcast to a room
        socket.broadcast
            .to(user.room)
            .emit('message', generateMessage(ADMIN, `${user.username} has joined`))
            io.to(user.room).emit('roomData', {
                room: user.room,
                users: getUserInRoom(user.room)
            })

        callback()
    })

    socket.on('sendMessage', (message, callback) => {
        const user = getUser(socket.id)

        const filter = new Filter()
        if (filter.isProfane(message)) {
            return callback('Profanity is not tolerated')
        }

        io.to(user.room).emit('message', generateMessage(user.username, message))
        callback() // calls the acknowledgement
    })

    socket.on('sendLocation', (coords, callback) => {
        const user = getUser(socket.id)

        if (!coords) {
            return false;
        }

        io.to(user.room).emit('locationMessage', generateLocationMessage(user.username, coords))
        callback(true)
    })

    socket.on('disconnect', () => {
        const user = removeUser(socket.id)

        if (user) {
            io.to(user.room)
              .emit('message', generateMessage(ADMIN, `${user.username} has left`))

            io.to(user.room).emit('roomData', {
                room: user.room,
                users: getUserInRoom(user.room)
            })
        }
    })
})

server.listen(PORT, () => {
    console.log(`listening to ${PORT}`)
})