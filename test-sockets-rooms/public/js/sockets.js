import { newConnectionLog, newErrorLog, newLog } from './roomsLog.js'

const socket = io()

export function createRoom(name) {
  socket.emit('room:create', name)
}

export function joinRoom(roomId, name) {
  socket.emit('room:join', roomId, name)
}

socket.on('connect', () => {
  newLog(`socket.id: <u>${socket.id}</u>`)
})

socket.on('room:created', (roomId, name) => {
  newConnectionLog(`Created room <u>${roomId}</u> as <u>${name}</u>`)
})

socket.on('room:joined.me', (roomId, name, users) => {
  newConnectionLog(
    `Joined to <u>${roomId}</u> as <u>${name}</u>. <i>[${users.join(', ')}]</i>`
  )
})

socket.on('room:joined.other', (roomId, name, users) => {
  newConnectionLog(
    `<u>${name}</u> joined to <u>${roomId}</u>. <i>[${users.join(', ')}]</i>`
  )
})

socket.on('room:error', newErrorLog)
