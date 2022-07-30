/*
  How To Build Sortable Drag & Drop With Vanilla Javascript - Web Dev Simplified
  https://www.youtube.com/watch?v=jfYWwQrtzzY
*/

const $draggables = document.querySelectorAll('.draggable')
const $containers = document.querySelectorAll('.container')

$draggables.forEach((draggable) => {
  // `dragstart` is fired as soon as we start dragging an element
  draggable.addEventListener('dragstart', () => {
    draggable.classList.add('dragging')
  })

  // `dragend` is fired when we let go the element
  draggable.addEventListener('dragend', () => {
    draggable.classList.remove('dragging')
  })
})

$containers.forEach((container) => {
  container.addEventListener('dragover', (e) => {
    e.preventDefault()
    const $draggable = document.querySelector('.dragging')

    // `e.clientY` is the Y position of our mouse on the screen
    const afterElement = getDragAfterElement(container, e.clientY)

    if (afterElement == null) {
      container.appendChild($draggable)
    } else {
      container.insertBefore($draggable, afterElement)
    }
  })
})

/**
 * Determine our mouse position when we're draggin our element and return which ever element our mouse position is directly after
 */
function getDragAfterElement(container, y) {
  /*
    We want to figure out whic element is directly after our mouse cursor so to keep track of that we need to figure out the offset between our cursor and the element that comes directly after it as well as the that is directly after it.
  */

  // select every draggable that we're not currentlly dragging
  const draggableElements = [
    ...container.querySelectorAll('.draggable:not(.dragging)'),
  ]

  // Loop through draggableElements and determine wich single element is the one that is directly after our mouse cursor based on the y position
  return draggableElements.reduce(
    (closest, child) => {
      const box = child.getBoundingClientRect()

      // When we are above an element, we get negative numbers, and when we are below an element, we get positive numbers. When we are between two elements, we get positive and negative numbers. When we are below all elements, we only get negative numbers
      const offset = y - box.top - box.height / 2

      // We only care about offsets that are negaive because that means that we're hovering above that element but we also want the offset that is the closest to zero becuase essentially if we're close as possible to zero that means we are barely having our cursor above that element
      return offset < 0 && offset > closest.offset
        ? { offset: offset, element: child }
        : closest
    },
    { offset: Number.NEGATIVE_INFINITY }
  ).element
}
