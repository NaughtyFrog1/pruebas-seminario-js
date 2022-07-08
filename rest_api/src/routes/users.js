const { Router } = require('express')
const fetch = require('node-fetch')

const router = Router()

router.get('/', async (req, res) => {
  const resp = await fetch('https://jsonplaceholder.typicode.com/users')
  const data = await resp.json()
  res.json(data)
})

router.get('/:id', async (req, res) => {
  const resp = await fetch(
    `https://jsonplaceholder.typicode.com/users/${req.params.id}`
  )
  const data = await resp.json()
  res.json(data)
})

module.exports = router
