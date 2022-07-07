const { Router } = require('express')

const router = Router()

router.get('/test', (req, res) => {
  res.json({ title: 'Hello, World!', test: true })
})

module.exports = router
