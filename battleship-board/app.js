const SQUARE_SIZE = 30
const SQUARES = 10
const SHIPS = Object.freeze({
  // shipName: shipSize
  carrier: 5,
  batthleship: 4,
  cruiser: 3,
  submarine: 3,
  destroyer: 2,
})

const boardState = initializeBoardState()
const shipPositionsState = initializeShipPositionState()
const shipHitsState = intitializeShipHitsState()

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

//* Functions

function initializeBoardState() {
  const board = []
  for (let row = 0; row < SQUARES; row++) {
    const boardRow = []
    for (let col = 0; col < SQUARES; col++) {
      boardRow.push({ hit: false, ship: '' })
    }
    board.push(boardRow)
  }
  return board
}

function initializeShipPositionState() {
  return Object.keys(SHIPS).reduce((obj, ship) => {
    obj[ship] = { row: 0, col: 0, direction: 'horizontal', positioned: false }
    return obj
  }, {})
}

function intitializeShipHitsState() {
  return Object.keys(SHIPS).reduce((obj, ship) => {
    obj[ship] = 0
    return obj
  }, {})
}

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

function moveShipPreview(parentNode, row, col) {
  parentNode.style.top = `${row * SQUARE_SIZE}px`
  parentNode.style.left = `${col * SQUARE_SIZE}px`
}

function updateInputPositionMax(ship, direction) {
  if (direction === 'horizontal') {
    $inputRow.max = SQUARES - 1
    $inputCol.max = SQUARES - SHIPS[ship]
  } else {
    $inputRow.max = SQUARES - SHIPS[ship]
    $inputCol.max = SQUARES - 1
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

//* Event handlers

function handleInputShipChange() {
  $inputRow.value = shipPositionsState[$inputShip.value].row
  $inputCol.value = shipPositionsState[$inputShip.value].col
  $inputDirection.value = shipPositionsState[$inputShip.value].direction

  updateInputPositionMax($inputShip.value, $inputDirection.value)
  renderShipPreview($shipPreview, $inputShip.value, $inputDirection.value)
  moveShipPreview($shipPreview, $inputRow.value, $inputCol.value)
}

function handleInptutShipDirectionChange() {
  $inputRow.value = 0
  $inputCol.value = 0

  updateInputPositionMax($inputShip.value, $inputDirection.value)
  renderShipPreview($shipPreview, $inputShip.value, $inputDirection.value)
  moveShipPreview($shipPreview, $inputRow.value, $inputCol.value)
}

function handleInputPositionChange() {
  moveShipPreview($shipPreview, $inputRow.value, $inputCol.value)
}

function handleBtnConfirmShip() {
  renderShipOnBoard(
    $playerBoard,
    $inputShip.value,
    $inputDirection.value,
    $inputRow.value,
    $inputCol.value
  )
}
