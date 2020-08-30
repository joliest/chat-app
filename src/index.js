const express = require('express')
const path = require('path')
const http = require('http')
const socketio = require('socket.io')

const app = express()
const server = http.createServer(app)
const io = socketio(server)

const PORT = process.env.PORT || 3000

const PUBLIC_FOLDER = path.join(__dirname, '../public')
app.use(express.static(PUBLIC_FOLDER))


io.on('connection', (socket) => {
    console.log('New Websocket Connection')
    socket.emit('message', 'Welcome!')

    socket.on('sendMessage', message => {
        io.emit('message', message)
    })
})

server.listen(PORT, () => {
    console.log(`listening to ${PORT}`)
})