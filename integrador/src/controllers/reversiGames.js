const path = require('path')
const { readFile, writeFile } = require('../utils/files.util')
const { getNewUniqueId } = require('../utils/ids.util')

const DIR_REVERSI = path.join(__dirname, '..', 'data', 'reversiGames.json')

function createGame(playerId) {
  const newGame = {
    players: {
      black: playerId,
      white: '',
    },
    turn: 'black',
    board: [
      ['', '', '', '', '', '', '', ''],
      ['', '', '', '', '', '', '', ''],
      ['', '', '', '', '', '', '', ''],
      ['', '', '', 'white', 'black', '', '', ''],
      ['', '', '', 'black', 'white', '', '', ''],
      ['', '', '', '', '', '', '', ''],
      ['', '', '', '', '', '', '', ''],
      ['', '', '', '', '', '', '', ''],
    ],
  }

  const games = readFile(DIR_REVERSI)
  const newId = getNewUniqueId(games)
  games[newId] = newGame
  writeFile(DIR_REVERSI, games)

  return {
    ok: true,
    data: {
      id: newId,
      game: newGame
    }
  }
}

function joinGame(playerId) {}

function connectGame(playerId) {}

module.exports = { createGame, joinGame, connectGame }
