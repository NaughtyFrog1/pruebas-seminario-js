import { SHIPS, SQUARES, SQUARE_SIZE } from './constants.js'
import * as ui from './ui.js'

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

ui.renderBoard($playerBoard)
ui.renderBoard($adversaryBoard)
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
  ui.renderShipOnBoard($playerBoard, ship, direction, row, col)
}

function unsetShipPosition(ship) {
  if (!Object.keys(SHIPS).includes(ship)) {
    alert('Invalid ship')
    return
  }
  shipsState[ship].positioned = false
  ui.removeShipOfBoard(
    $playerBoard,
    ship,
    shipsState[ship].direction,
    shipsState[ship].row,
    shipsState[ship].col
  )
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
    if (boardState[parsedRow + rowOffset][parsedCol].ship) return false
  }
  return true
}

//* Event handlers

function handleInputShipChange() {
  $inputRow.value = shipsState[$inputShip.value].row
  $inputCol.value = shipsState[$inputShip.value].col
  $inputDirection.value = shipsState[$inputShip.value].direction

  if (shipsState[$inputShip.value].positioned) {
    ui.hideShipPreview($shipPreview)
  } else {
    ui.showShipPreview($shipPreview)
  }

  updateInputPositionMax($inputShip.value, $inputDirection.value)
  ui.renderShipPreview($shipPreview, $inputShip.value, $inputDirection.value)
  ui.moveShipPreview($shipPreview, $inputRow.value, $inputCol.value)
}

function handleInptutShipDirectionChange() {
  $inputRow.value = 0
  $inputCol.value = 0

  if (shipsState[$inputShip.value].positioned) {
    unsetShipPosition($inputShip.value)
    ui.showShipPreview($shipPreview)
  }

  updateInputPositionMax($inputShip.value, $inputDirection.value)
  ui.renderShipPreview($shipPreview, $inputShip.value, $inputDirection.value)
  ui.moveShipPreview($shipPreview, $inputRow.value, $inputCol.value)
}

function handleInputPositionChange() {
  if (shipsState[$inputShip.value].positioned) {
    unsetShipPosition($inputShip.value)
    ui.showShipPreview($shipPreview)
  }

  ui.moveShipPreview($shipPreview, $inputRow.value, $inputCol.value)
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
