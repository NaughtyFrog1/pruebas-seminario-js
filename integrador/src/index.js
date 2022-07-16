const express = require('express')
const app = express()
const httpServer = require('http').createServer(app)
const io = require('socket.io')(httpServer)

const reversiHandlers = require('./handlers/reversiHandlers')

//* Settings
app.set('port', process.env.PORT || 3000)

//* Middlewares
app.use(express.static('public'))

//* Sockets
io.on('connection', (socket) => {
  reversiHandlers(io, socket)
})

//* Start server
httpServer.listen(app.get('port'), () => {
  console.log(`Server listening on http://localhost:${app.get('port')} \n\n`)
})
