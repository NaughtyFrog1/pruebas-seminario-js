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
  for (let pos = 0; pos < 64; pos++) {
    $board.children[pos].dataset.pieceType = board[parseInt(pos / 8)][pos % 8]
  }
}

renderBoard(board)
