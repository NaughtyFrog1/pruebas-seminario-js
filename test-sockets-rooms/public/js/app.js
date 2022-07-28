import { newLog } from './roomsLog.js'
import { createRoom, joinRoom } from './sockets.js'

newLog('Connect to a room to see information')

document.querySelector('#btnCreate').addEventListener('click', (e) => {
  e.preventDefault()
  const $inputName = document.querySelector('#inputName')

  createRoom($inputName.value)
})

document.querySelector('#btnJoin').addEventListener('click', (e) => {
  e.preventDefault()
  const $inputName = document.querySelector('#inputName')
  const $inputRoomId = document.querySelector('#inputRoomId')

  joinRoom($inputRoomId.value, $inputName.value)
})
