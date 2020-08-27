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


let count = 0;
io.on('connection', (socket) => {
    console.log('New Websocket Connection')

    // sends this to the client side
    socket.emit('countUpdated', count++)

    socket.on('increment', () => {
        count++
        // socket.emit('countUpdated', count)
        // emits to every single client connection
        io.emit('countUpdated', count)
    })
})

server.listen(PORT, () => {
    console.log(`listening to ${PORT}`)
})