const states = ['', 'black', 'white', 'can-put-black', 'can-put-white']
let count = 0

window.addEventListener('load', () => {
  const $btn = document.querySelector('.toggle-btn')
  const $piece = document.querySelector('.piece')

  $btn.addEventListener('click', () => {
    count = (count + 1) % states.length
    $piece.dataset.piece = states[count]
  })
})
