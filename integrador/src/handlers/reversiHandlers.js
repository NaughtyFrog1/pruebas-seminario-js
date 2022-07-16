const players = require('../controllers/players')
const reversi = require('../controllers/reversiGames')

module.exports = (io, socket) => {
  socket.on('reversi:create', (name) => {  
    const newPlayer = players.add(name, socket.id)
    if (!newPlayer.ok) {
      socket.emit('reversi:created', newPlayer)
      return
    }

    const newGame = reversi.createGame(newPlayer.data.id)

    socket.emit('reversi:created', {
      ok: true,
      data: {
        idPlayer: newPlayer.data.id,
        idGame: newGame.data.id,
        isPlayable: false,
        isYourTurn: true,
        board: newGame.data.game.board
      }
    })
  })

  socket.on('reversi:join', (name, idGame) => {})

  socket.on('reversi:connect', (idPlayer, idGame) => {})
}
