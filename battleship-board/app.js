const SQUARE_SIZE = 30
const SQUARES = 10
const SHIPS = Object.freeze({
  // shipName: shipSize
  carrier: 5,
  battleship: 4,
  cruiser: 3,
  submarine: 3,
  destroyer: 2,
})

const boardState = initializeBoardState()
const shipsState = initializeShipsState()

const $playerStatus = document.querySelector('#bbPlayerStatus')
const $adversaryStatus = document.querySelector('#bbAdversaryStatus')
const $playerBoard = document.querySelector('#bbPlayerBoard')
const $adversaryBoard = document.querySelector('#bbAdversaryBoard')
const $inputShip = document.querySelector('#bbShipsSelect')
const $inputDirection = document.querySelector('#bbShipsDirection')
const $inputRow = document.querySelector('#bbShipPositionRow')
const $inputCol = document.querySelector('#bbShipPositionCol')
const $btnConfirmShip = document.querySelector('#bbBtnConfirmShip')
const $bntConfirmAll = document.querySelector('#bbBtnConfimAll')
const $shipPreview = document.querySelector('#bbShipPreview')

//* Program

document.documentElement.style.setProperty('--square-size', `${SQUARE_SIZE}px`)

renderBoard($playerBoard)
renderBoard($adversaryBoard)
handleInputShipChange()

//* Events

$inputShip.addEventListener('input', handleInputShipChange)
$inputDirection.addEventListener('input', handleInptutShipDirectionChange)
$inputRow.addEventListener('input', handleInputPositionChange)
$inputCol.addEventListener('input', handleInputPositionChange)
$btnConfirmShip.addEventListener('click', handleBtnConfirmShip)

// Disable writing
$inputRow.addEventListener('keypress', (e) => e.preventDefault())
$inputCol.addEventListener('keypress', (e) => e.preventDefault())

//* State Initializers

function initializeBoardState() {
  const board = []
  for (let row = 0; row < SQUARES; row++) {
    const boardRow = []
    for (let col = 0; col < SQUARES; col++) {
      boardRow.push({ ship: false, hit: false })
    }
    board.push(boardRow)
  }
  return board
}

function initializeShipsState() {
  return Object.keys(SHIPS).reduce((obj, ship) => {
    obj[ship] = {
      row: 0,
      col: 0,
      direction: 'horizontal',
      positioned: false,
      hits: 0,
    }
    return obj
  }, {})
}

//* State Setters

function setShipPosition(ship, direction, row, col) {
  if (
    !Object.keys(SHIPS).includes(ship) ||
    (direction !== 'horizontal' && direction !== 'vertical') ||
    !isValidPosition(ship, direction, row, col)
  ) {
    alert('Invalid ship data')
    return
  }
  shipsState[ship] = {
    ...shipsState[ship],
    row,
    col,
    direction,
    positioned: true,
  }
  renderShipOnBoard($playerBoard, ship, direction, row, col)
}

function unsetShipPosition(ship) {
  if (!Object.keys(SHIPS).includes(ship)) {
    alert('Invalid ship')
    return
  }
  shipsState[ship].positioned = false
  removeShipOfBoard(
    $playerBoard,
    ship,
    shipsState[ship].direction,
    shipsState[ship].row,
    shipsState[ship].col
  )
}

//* UI Functions

function renderBoard(board) {
  for (let row = 0; row < SQUARES ** 2; row++) {
    const square = document.createElement('div')
    square.classList.add('bb-board__square')
    board.appendChild(square)
  }
}

function renderShipPreview(parentNode, ship, direction) {
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

function moveShipPreview(node, row, col) {
  node.style.top = `${row * SQUARE_SIZE}px`
  node.style.left = `${col * SQUARE_SIZE}px`
}

function hideShipPreview(node) {
  node.classList.add('d-none')
}

function showShipPreview(node) {
  node.classList.remove('d-none')
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

function renderShipOnBoard(board, ship, direction, rowStart, colStart) {
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

function removeShipOfBoard(board, ship, direction, rowStart, colStart) {
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

//* General Purpose Functions

function updateInputPositionMax(ship, direction) {
  if (direction === 'horizontal') {
    $inputRow.max = SQUARES - 1
    $inputCol.max = SQUARES - SHIPS[ship]
  } else {
    $inputRow.max = SQUARES - SHIPS[ship]
    $inputCol.max = SQUARES - 1
  }
}

function isValidPosition(ship, direction, row, col) {
  const parsedRow = parseInt(row, 10)
  const parsedCol = parseInt(col, 10)

  if (direction === 'horizontal') {
    for (let colOffset = 0; colOffset < SHIPS[ship]; colOffset++) {
      if (boardState[parsedRow][parsedCol + colOffset].ship) return false
    }
    return true
  }
  for (let rowOffset = 0; rowOffset < SHIPS[ship]; rowOffset++) {
    if (boardState[parsedRow + rowOffset][parsedCol].ship) return true
  }
  return false
}

//* Event handlers

function handleInputShipChange() {
  $inputRow.value = shipsState[$inputShip.value].row
  $inputCol.value = shipsState[$inputShip.value].col
  $inputDirection.value = shipsState[$inputShip.value].direction

  if (shipsState[$inputShip.value].positioned) {
    hideShipPreview($shipPreview)
  } else {
    showShipPreview($shipPreview)
  }

  updateInputPositionMax($inputShip.value, $inputDirection.value)
  renderShipPreview($shipPreview, $inputShip.value, $inputDirection.value)
  moveShipPreview($shipPreview, $inputRow.value, $inputCol.value)
}

function handleInptutShipDirectionChange() {
  $inputRow.value = 0
  $inputCol.value = 0

  if (shipsState[$inputShip.value].positioned) {
    unsetShipPosition($inputShip.value)
    showShipPreview($shipPreview)
  }

  updateInputPositionMax($inputShip.value, $inputDirection.value)
  renderShipPreview($shipPreview, $inputShip.value, $inputDirection.value)
  moveShipPreview($shipPreview, $inputRow.value, $inputCol.value)
}

function handleInputPositionChange() {
  if (shipsState[$inputShip.value].positioned) {
    unsetShipPosition($inputShip.value)
    showShipPreview($shipPreview)
  }

  moveShipPreview($shipPreview, $inputRow.value, $inputCol.value)
}

function handleBtnConfirmShip() {
  setShipPosition(
    $inputShip.value,
    $inputDirection.value,
    $inputRow.value,
    $inputCol.value
  )

  // $inputShip.value =
  //   $inputShip.options[
  //     ($inputShip.selectedIndex + 1) % $inputShip.options.length
  //   ].value
}
