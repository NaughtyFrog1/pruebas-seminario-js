const path = require('path')
const { validateName } = require('../utils/validators.util')
const { readFile, writeFile } = require('../utils/files.util')
const { getNewUniqueId } = require('../utils/ids.util')

const DIR_PLAYERS = path.join(__dirname, '..', 'data', 'players.json')

const connectedPlayers = {}

function add(name, socketId) {
  const validatedName = validateName(name)
  if (!validatedName.ok) return validatedName

  if (socketExists(socketId)) {
    return { ok: false, errors: ["You're already coneccted to a room"] }
  }

  const players = readFile(DIR_PLAYERS)
  const newId = getNewUniqueId(players)
  players[newId] = validatedName.data.sanitizedName
  writeFile(DIR_PLAYERS, players)
  connectedPlayers[newId] = socketId

  return {
    ok: true,
    data: { id: newId, name: validatedName.data.sanitizedName },
  }
}

function remove(id) {}

function connect(id) {}

function disconnect(id) {}

function isConnected(id) {
  return connectedPlayers.hasOwnProperty(id)
}

function exists(id) {
  const players = readFile(DIR_PLAYERS)
  return players.hasOwnProperty(id)
}

function get(id) {
  const players = readFile(DIR_PLAYERS)
  return {
    connectedData: connectedPlayers[id] ?? null,
    playerData: players[id] ?? null,
  }
}

function socketExists(socketId) {
  return Object.values(connectedPlayers).includes(socketId)
}

module.exports = {
  add,
  remove,
  connect,
  disconnect,
  isConnected,
  exists,
  get,
  socketExists,
}
