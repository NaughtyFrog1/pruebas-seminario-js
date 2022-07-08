const path = require('path')
const { Router } = require('express')
const { readFile, writeFile, validateSchema } = require('../helpers')

const router = Router()

const MOVIES_PATH = path.join(__dirname, '..', 'data', 'sample.json')

const movieSchema = {
  title: (value) => typeof value === 'string' && value.length > 0,
  director: (value) => typeof value === 'string' && value.length > 0,
  year: (value) => typeof value === 'number',
  rating: (value) => typeof value === 'number',
}
movieSchema.title.required = true
movieSchema.director.required = true
movieSchema.year.required = true
movieSchema.rating.required = true

router.get('/', (req, res) => {
  res.json(readFile(MOVIES_PATH))
})

router.post('/', (req, res) => {
  const errors = validateSchema(req.body, movieSchema)
  if (errors.length > 0) {
    res.status(400).json(errors)
  } else {
    const movies = readFile(MOVIES_PATH)
    const newMovie = {
      id: (movies[movies.length - 1]?.id ?? 0) + 1,
      ...req.body,
    }
    movies.push(newMovie)
    writeFile(MOVIES_PATH, movies)
    res.status(200).json(movies)
  }
})

module.exports = router