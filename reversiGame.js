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

function isValidPosition(row, col) {
  return row >= 0 && row < 8 && col >= 0 && col < 8
}

function cloneBoard(board) {
  return JSON.parse(JSON.stringify(board))
}

function getOpponenTile(tile) {
  return tile === 'black' ? 'white' : 'black'
}

function isValidMove(tile, board, rowStart, colStart) {
  if (
    !isValidPosition(rowStart, colStart) ||
    board[rowStart][colStart] !== ''
  ) {
    return false
  }

  const opponentTile = getOpponenTile(tile)
  return directions.some(([rowDirection, colDirection]) => {
    let row = rowStart
    let col = colStart
    do {
      row += rowDirection
      col += colDirection
    } while (isValidPosition(row, col) && board[row][col] === opponentTile)
    return (
      isValidPosition(row, col) &&
      board[row][col] === tile &&
      (row !== rowStart + rowDirection || col !== colStart + colDirection)
    )
  })
}

function getValidMoves(tile, board) {
  const validMoves = []
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      isValidMove(tile, board, row, col) && validMoves.push([row, col])
    }
  }
  return validMoves
}

function getBoardWithValidMoves(tile, board) {
  const clonedBoard = cloneBoard(board)
  getValidMoves(tile, clonedBoard).forEach(([row, col]) => {
    clonedBoard[row][col] = `can-move-${tile}`
  })
  return clonedBoard
}

function getTilesToFlip(tile, board, rowStart, colStart) {
  if (
    !isValidPosition(rowStart, colStart) ||
    board[rowStart][colStart] !== ''
  ) {
    return []
  }

  const opponentTile = getOpponenTile(tile)
  const tilesToFlip = []

  directions.forEach(([rowDirection, colDirection]) => {
    let row = rowStart
    let col = colStart
    do {
      row += rowDirection
      col += colDirection
    } while (isValidPosition(row, col) && board[row][col] === opponentTile)
    if (isValidPosition(row, col) && board[row][col] === tile) {
      row -= rowDirection
      col -= colDirection
      while (row !== rowStart || col !== colStart) {
        tilesToFlip.push([row, col])
        row -= rowDirection
        col -= colDirection
      }
    }
  })
  return tilesToFlip
}

function makeMove(tile, board, rowStart, colStart) {
  const tilesToFlip = getTilesToFlip(tile, board, rowStart, colStart)
  board[rowStart][colStart] = tile
  tilesToFlip.forEach(([row, col]) => (board[row][col] = tile))
}

/*
  TESTS
*/

function testGetBoardWithValidMoves1() {
  console.log('testGetBoardWithValidMoves1')

  const input = [
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', 'black', '', '', '', ''],
    ['', '', '', 'black', 'black', 'white', '', ''],
    ['', '', '', 'black', 'black', 'black', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
  ]
  const expectedOutput = [
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', 'black', '', '', '', ''],
    ['', '', 'can-move-white', 'black', 'black', 'white', '', ''],
    ['', '', '', 'black', 'black', 'black', '', ''],
    ['', '', '', 'can-move-white', '', 'can-move-white', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
  ]

  const output = getBoardWithValidMoves('white', input)
  // console.log(output)
  return JSON.stringify(output) === JSON.stringify(expectedOutput)
}

function testGetBoardWithValidMoves2() {
  console.log('testGetBoardWithValidMoves1')

  const input = [
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', 'white', 'black', '', '', ''],
    ['', '', '', 'black', 'white', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
  ]
  const expectedOutput = [
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', 'can-move-black', '', '', '', ''],
    ['', '', 'can-move-black', 'white', 'black', '', '', ''],
    ['', '', '', 'black', 'white', 'can-move-black', '', ''],
    ['', '', '', '', 'can-move-black', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
  ]

  const output = getBoardWithValidMoves('black', input)
  // console.log(output)
  return JSON.stringify(output) === JSON.stringify(expectedOutput)
}

function testMakeMove() {
  const input = [
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', 'white', 'black', '', '', ''],
    ['', '', '', 'black', 'white', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
  ]
  const expectedOutput = [
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['', '', 'white', 'black', '', '', '', ''],
    ['', '', '', 'white', 'black', '', '', ''],
    ['', '', '', 'black', 'white', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
  ]

  makeMove('black', input, 2, 3)
  makeMove('white', input, 2, 2)
  return JSON.stringify(input) === JSON.stringify(expectedOutput)
}

console.log(testGetBoardWithValidMoves1())
console.log(testGetBoardWithValidMoves2())
console.log(testMakeMove())
