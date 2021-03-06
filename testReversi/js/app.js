const $board = document.querySelector('#reversiBoard')

let board = [
  ['', '', '', '', '', '', '', ''],
  ['', '', '', '', '', '', '', ''],
  ['', '', '', '', '', '', '', ''],
  ['', '', '', 'white', 'black', '', '', ''],
  ['', '', '', 'black', 'white', '', '', ''],
  ['', '', '', '', '', '', '', ''],
  ['', '', '', '', '', '', '', ''],
  ['', '', '', '', '', '', '', ''],
]

function renderBoard(board) {
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const $piece = document.createElement('div')

      $piece.innerHTML = `
        <div class="piece__inner">
          <div class="piece__black"></div>
          <div class="piece__white"></div>
        </div>
        <div class="piece__can-put"></div>
      `
      $piece.classList.add('piece')
      $piece.dataset.pieceType = board[row][col]

      $board.appendChild($piece)
    }
  }
}

function updateBoard(board) {
  $board.childNodes.forEach(
    (square, i) => (square.dataset.pieceType = board[parseInt(i / 8)][i % 8])
  )
}

renderBoard(board)
