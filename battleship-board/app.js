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
      boardRow.push(false)
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
  const parsedRow = parseInt(row, 10)
  const parsedCol = parseInt(col, 10)

  if (
    !Object.keys(SHIPS).includes(ship) ||
    !isValidPosition(ship, direction, parsedRow, parsedCol)
  ) {
    alert('Invalid ship data')
    return false
  }
  shipsState[ship] = {
    ...shipsState[ship],
    row: parsedRow,
    col: parsedCol,
    direction,
    positioned: true,
  }
  return true
}

function unsetShipPosition(ship) {
  if (!Object.keys(SHIPS).includes(ship)) {
    alert('Invalid ship')
    return false
  }
  shipsState[ship].positioned = false
  return true
}

//* Validations

function isBetween(num, min, max) {
  return num >= min && num <= max
}

function isValidPosition(ship, direction, row, col) {
  const parsedRow = parseInt(row, 10)
  const parsedCol = parseInt(col, 10)

  if (
    (direction !== 'horizontal' && direction !== 'vertical') ||
    parsedCol < 0 ||
    parsedRow < 0 ||
    (direction === 'horizontal' && parsedCol > SQUARES - SHIPS[ship]) ||
    (direction === 'vertical' && parsedRow > SQUARES - SHIPS[ship])
  ) {
    return false
  }

  return !Object.entries(shipsState).some(([shipEntry, shipState]) => {
    if (!shipState.positioned) return false

    if (direction === 'horizontal') {
      const colEnd = parsedCol + SHIPS[ship] - 1
      if (shipState.direction === 'horizontal') {
        return (
          parsedRow === shipState.row &&
          (isBetween(shipState.col, parsedCol, colEnd) ||
            isBetween(shipState.col + SHIPS[ship] - 1, parsedCol, colEnd))
        )
      }
      return (
        isBetween(shipState.col, parsedCol, colEnd) &&
        isBetween(
          parsedRow,
          shipState.row,
          shipState.row + SHIPS[shipEntry] - 1
        )
      )
    }
    const rowEnd = parsedRow + SHIPS[ship] - 1
    if (shipState.direction === 'horizontal') {
      return (
        isBetween(
          parsedCol,
          shipState.col,
          shipState.col + SHIPS[shipEntry] - 1
        ) && isBetween(shipState.row, parsedRow, rowEnd)
      )
    }
    return (
      parsedCol === shipState.col &&
      (isBetween(shipState.row, parsedRow, rowEnd) ||
        isBetween(shipState.row + SHIPS[ship] - 1, parsedRow, rowEnd))
    )
  })
}

function areAllShipsPositioned() {
  return Object.values(shipsState).every(({ positioned }) => positioned)
}

//* Side effects of events handlers

function changePositionEffect() {
  if (shipsState[$inputShip.value].positioned) {
    const shipUnseted = unsetShipPosition($inputShip.value)
    if (shipUnseted) {
      $bntConfirmAll.disabled = false
      ui.removeShipOfBoard(
        $playerBoard,
        $inputShip.value,
        shipsState[$inputShip.value].direction,
        shipsState[$inputShip.value].row,
        shipsState[$inputShip.value].col
      )
      ui.showShipPreview($shipPreview)
    }
  }
  if (
    isValidPosition(
      $inputShip.value,
      $inputDirection.value,
      $inputRow.value,
      $inputCol.value
    )
  ) {
    ui.removeRedFromShipPreview($shipPreview)
    $btnConfirmShip.disabled = false
  } else {
    ui.turnRedShipPreview($shipPreview)
    $btnConfirmShip.disabled = true
  }
  ui.moveShipPreview($shipPreview, $inputRow.value, $inputCol.value)
}

function changeDirectionEffect() {
  if ($inputDirection.value === 'horizontal') {
    $inputRow.max = SQUARES - 1
    $inputCol.max = SQUARES - SHIPS[$inputShip.value]
  } else {
    $inputRow.max = SQUARES - SHIPS[$inputShip.value]
    $inputCol.max = SQUARES - 1
  }

  ui.renderShipPreview($shipPreview, $inputShip.value, $inputDirection.value)
}

//* Event handlers

function handleInputShipChange() {
  $inputRow.value = shipsState[$inputShip.value].row
  $inputCol.value = shipsState[$inputShip.value].col
  $inputDirection.value = shipsState[$inputShip.value].direction

  if (shipsState[$inputShip.value].positioned) {
    ui.hideShipPreview($shipPreview)
  }

  changePositionEffect()
  changeDirectionEffect()
}

function handleInptutShipDirectionChange() {
  $inputRow.value = 0
  $inputCol.value = 0

  changePositionEffect()
  changeDirectionEffect()
}

function handleInputPositionChange() {
  changePositionEffect()
}

function handleBtnConfirmShip() {
  const shipSetted = setShipPosition(
    $inputShip.value,
    $inputDirection.value,
    $inputRow.value,
    $inputCol.value
  )

  if (shipSetted) {
    $bntConfirmAll.disabled = !areAllShipsPositioned()
    ui.renderShipOnBoard(
      $playerBoard,
      $inputShip.value,
      $inputDirection.value,
      $inputRow.value,
      $inputCol.value
    )


  }
}
