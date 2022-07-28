const $log = document.querySelector('#roomsLog')

export function newLog(message) {
  $log.innerHTML += `
    <p class="mb-1">
      <b class="text-muted small">[ ${new Date().toLocaleString()} ]</b> 
      ${message}
    </p>
  `
}

export function newErrorLog(message) {
  $log.innerHTML += `
    <p class="text-danger mb-1">
      <b class="text-muted small">[ ${new Date().toLocaleString()} ]</b>
      ${message}
    </p>
  `
}

export function newConnectionLog(message) {
  $log.innerHTML += `
  <p class="text-primary mb-1">
    <b class="text-muted small">[ ${new Date().toLocaleString()} ]</b>
    ${message}
  </p>
`
}