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

function renderShipPreview(ship, direction) {
  const shipDiv = document.createElement('div')
  shipDiv.classList.add('bb-ship')
  if (direction === 'vertical') {
    shipDiv.classList.add('bb-ship--vertical')
  }

  for (let i = 0; i < SHIPS[ship]; i++) {
    const shipBody = document.createElement('div')
    shipBody.classList.add('bb-ship__body')
    shipDiv.appendChild(shipBody)
  }
  shipDiv.children[0].classList.add('bb-ship__body--tail')
  shipDiv.children[shipDiv.children.length - 1].classList.add(
    'bb-ship__body--head'
  )

  $shipPreview.innerHTML = ''
  $shipPreview.appendChild(shipDiv)
}

function moveShipPreview(row, col) {
  $shipPreview.style.top = `${row * SQUARE_SIZE}px`
  $shipPreview.style.left = `${col * SQUARE_SIZE}px`
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

function handleInputShipChange() {
  $inputRow.value = shipPositionsState[$inputShip.value].row
  $inputCol.value = shipPositionsState[$inputShip.value].col
  $inputDirection.value = shipPositionsState[$inputShip.value].direction

  renderShipPreview($inputShip.value)
  updateInputPositionMax($inputShip.value, $inputDirection.value)
  moveShipPreview($inputRow.value, $inputCol.value)
}

function handleInptutShipDirectionChange() {
  if ($inputDirection.value === 'horizontal') {
    $shipPreview.firstElementChild.classList.remove('bb-ship--vertical')
  } else if ($inputDirection.value === 'vertical') {
    $shipPreview.firstElementChild.classList.add('bb-ship--vertical')
  }
  $inputRow.value = 0
  $inputCol.value = 0

  updateInputPositionMax($inputShip.value, $inputDirection.value)
  moveShipPreview($inputRow.value, $inputCol.value)
}

function handleInputPositionChange() {
  moveShipPreview($inputRow.value, $inputCol.value)
}
