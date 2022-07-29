const board = [
  ['', '', '', '', '', '', '', ''],
  ['', '', '', '', '', '', '', ''],
  ['', '', '', '', '', '', '', ''],
  ['', '', '', 'white', 'black', '', '', ''],
  ['', '', '', 'black', 'white', '', '', ''],
  ['', '', '', '', '', '', '', ''],
  ['', '', '', '', '', '', '', ''],
  ['', '', '', '', '', '', '', ''],
]

// isOnBoard
function isValidPosition(row, col) {
  return row >= 0 && row < 8 && col >= 0 && col < 8
}

// isValidMove - getMove
function isValidMove(tile, board, xStart, yStart) {
  if (!isValidPosition(xStart, yStart) || board[xStart][yStart] !== '') {
    return []
  }

  const opponentTile = tile === 'black' ? 'white' : 'black'
  const tilesToFlip = []
  const directions = [
    [-1, -1],
    [-1, 0],
    [-1, 1],
    [0, -1],
    [0, 1],
    [1, -1],
    [1, 0],
    [1, 1],
  ]

  directions.forEach(([xDirection, yDirection]) => {
    let x = xStart + xDirection
    let y = yStart + yDirection

    while (isValidPosition(x, y) && board[x][y] === opponentTile) {
      x += xDirection
      y += yDirection
    }
    if (isValidPosition(x, y) && board[x][y] === tile) {
      x -= xDirection
      y -= yDirection
      while (x !== xStart || y !== yStart) {
        tilesToFlip.push([x, y])
        x -= xDirection
        y -= yDirection
      }
    }
  })

  return tilesToFlip
}

// getBoardCopy
function cloneBoard(board) {
  return JSON.parse(JSON.stringify(board))
}

// getValidMoves
function getValidMoves(tile, board) {
  const validMoves = []
  for (let x = 0; x < 8; x++) {
    for (let y = 0; y < 8; y++) {
      if (isValidMove(tile, board, x, y).length !== 0) validMoves.push([x, y])
    }
  }
  return validMoves
}

// getBoardWithValidMoves
function getBoardWithValidMoves(tile, board) {
  const clonedBoard = cloneBoard(board)
  getValidMoves(tile, clonedBoard).forEach(
    ([x, y]) => (clonedBoard[x][y] = `can-move-${tile}`)
  )
  return clonedBoard
}

function getBoardScore(board) {
  let black = 0
  let white = 0
  for (let x = 0; x < 8; x++) {
    for (let y = 0; y < 8; y++) {
      if (board[x][y] === 'black') black += 1
      else if (board[x][y] === 'white') white += 1
    }
  }
  return { black, white }
}

function makeMove(tile, board, xStart, yStart) {
  const tilesToFlip = isValidMove(tile, board, xStart, yStart)
  if (tilesToFlip.length === 0) return false
  board[xStart][yStart] = tile
  tilesToFlip.forEach(([x, y]) => (board[x][y] = tile))
  return true
}

/*
     PYTHON                      JAVASCRIPT
[ ]  drawBoard               ->  x
[ ]  getNewBoard             ->  x
[x]  isValidMove             ->  isValidMove
[x]  isOnBoard               ->  isValidPosition
[x]  getBoardWithValidMoves  ->  getBoardWithValidMoves
[x]  getValidMoves           ->  getValidMoves
[x]  getScoreOfBoard         ->  getBoardScore
[ ]  enterPlayerTile         ->  x
[ ]  whoGoesFirst            ->  x
[x]  makeMove                ->  makeMove
[x]  getBoardCopy            ->  cloneBoard
[ ]  isOnCorner              ->  x
[ ]  getPlayerMove           ->  x
[ ]  getComputerMove         ->  x
[ ]  printScore              ->  x
[ ]  playGame                ->  x
*/

console.log(getBoardWithValidMoves('white', board))
