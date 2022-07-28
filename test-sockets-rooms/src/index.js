const express = require('express')
const app = express()
const httpServer = require('http').createServer(app)
const io = require('socket.io')(httpServer)

const { nanoid } = require('nanoid')

//* Settings
app.set('port', process.env.PORT || 3000)

//* Middlewares
app.use(express.static('public'))

const roomsUsers = {}

//* Sockets
io.on('connection', (socket) => {
  socket.on('room:create', (name) => {
    const sanitizedName = String(name).trim()

    if (sanitizedName === '') {
      socket.emit('room:error', 'The name is invalid')
      return
    }

    const newRoomId = nanoid(8)
    socket.join(newRoomId)
    roomsUsers[newRoomId] = [sanitizedName]

    console.log(roomsUsers)
    socket.emit('room:created', newRoomId, sanitizedName)
  })

  socket.on('room:join', (roomId, name) => {
    const sanitizedName = String(name).trim()

    if (sanitizedName === '') {
      socket.emit('room:error', 'The name is invalid')
      return
    }
    if (!roomsUsers.hasOwnProperty(roomId)) {
      socket.emit('room:error', "The room doesn't exists")
      return
    }

    socket.join(roomId)
    roomsUsers[roomId].push(sanitizedName)

    console.log(roomsUsers)


    io.sockets.adapter.rooms.get(roomId).forEach((socketId) => {
      console.log(socketId, socketId === socket.id)
      io.to(socketId).emit(
        socketId === socket.id ? 'room:joined.me' : 'room:joined.other',
        roomId,
        sanitizedName,
        roomsUsers[roomId]
      )
    })
  })
})

//* Start server
httpServer.listen(app.get('port'), () => {
  console.log(`Server listening on http://localhost:${app.get('port')} \n\n`)
})
