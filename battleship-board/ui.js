import { SHIPS, SQUARES, SQUARE_SIZE } from './constants.js'

//* Ship Preview

export function renderShipPreview(parentNode, ship, direction) {
  const container = document.createElement('div')
  container.classList.add('bb-ship-preview', `bb-ship-preview--${direction}`)

  for (let i = 0; i < SHIPS[ship]; i++) {
    const shipContainer = document.createElement('div')
    shipContainer.classList.add('bb-ship', `bb-ship--${direction}`)

    const shipBody = document.createElement('div')
    shipBody.classList.add('bb-ship__body')

    shipContainer.appendChild(shipBody)
    container.appendChild(shipContainer)
  }
  container.firstChild.firstChild.classList.add('bb-ship__body--tail')
  container.lastChild.firstChild.classList.add('bb-ship__body--head')
  parentNode.innerHTML = ''
  parentNode.appendChild(container)
}

export function moveShipPreview(node, row, col) {
  node.style.top = `${row * SQUARE_SIZE}px`
  node.style.left = `${col * SQUARE_SIZE}px`
}

export function hideShipPreview(node) {
  node.classList.add('d-none')
}

export function showShipPreview(node) {
  node.classList.remove('d-none')
}

export function turnRedShipPreview(node) {
  node.classList.add('bb-ship--red')
}

export function removeRedFromShipPreview(node) {
  node.classList.remove('bb-ship--red')
}

//* Boards

export function renderBoard(board) {
  for (let row = 0; row < SQUARES ** 2; row++) {
    const square = document.createElement('div')
    square.classList.add('bb-board__square')
    board.appendChild(square)
  }
}

function renderShipOnSquare(square, direction, part = '') {
  const shipContainer = document.createElement('div')
  if (direction === 'horizontal') {
    shipContainer.classList.add('bb-ship--horizontal')
  } else if (direction === 'vertical') {
    shipContainer.classList.add('bb-ship--vertical')
  }

  const shipBody = document.createElement('div')
  shipBody.classList.add('bb-ship__body')
  if (part === 'head') {
    shipBody.classList.add('bb-ship__body--head')
  } else if (part === 'tail') {
    shipBody.classList.add('bb-ship__body--tail')
  }

  shipContainer.appendChild(shipBody)
  square.appendChild(shipContainer)
}

export function renderShipOnBoard(board, ship, direction, rowStart, colStart) {
  const parsedRow = parseInt(rowStart, 10)
  const parsedCol = parseInt(colStart, 10)

  if (direction === 'horizontal') {
    const shipTailPos = parsedRow * SQUARES + parsedCol
    const shipHeadPos = parsedRow * SQUARES + parsedCol + SHIPS[ship] - 1
    renderShipOnSquare(board.children[shipTailPos], direction, 'tail')
    renderShipOnSquare(board.children[shipHeadPos], direction, 'head')
    for (let colOffset = 1; colOffset < SHIPS[ship] - 1; colOffset++) {
      const shipPos = parsedRow * SQUARES + parsedCol + colOffset
      renderShipOnSquare(board.children[shipPos], direction)
    }
  } else if (direction === 'vertical') {
    const shipHeadPos = parsedRow * SQUARES + parsedCol
    const shipTailPos = (parsedRow + SHIPS[ship] - 1) * SQUARES + parsedCol
    renderShipOnSquare(board.children[shipTailPos], direction, 'tail')
    renderShipOnSquare(board.children[shipHeadPos], direction, 'head')
    for (let rowOffset = 1; rowOffset < SHIPS[ship] - 1; rowOffset++) {
      const shipPos = (parsedRow + rowOffset) * SQUARES + parsedCol
      renderShipOnSquare(board.children[shipPos], direction)
    }
  }
}

export function removeShipOfBoard(board, ship, direction, rowStart, colStart) {
  const parsedRow = parseInt(rowStart, 10)
  const parsedCol = parseInt(colStart, 10)

  if (direction === 'horizontal') {
    for (let colOffset = 0; colOffset < SHIPS[ship]; colOffset++) {
      const shipPos = parsedRow * SQUARES + parsedCol + colOffset
      board.children[shipPos].innerHTML = ''
    }
  } else {
    for (let rowOffset = 0; rowOffset < SHIPS[ship]; rowOffset++) {
      const shipPos = (parsedRow + rowOffset) * SQUARES + parsedCol
      board.children[shipPos].innerHTML = ''
    }
  }
}
