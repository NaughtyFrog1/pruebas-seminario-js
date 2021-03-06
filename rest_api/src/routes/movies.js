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
  const resp = { status: 200, data: null }
  if (req.query.hasOwnProperty('year')) {
    const parsedYear = parseInt(req.query.year, 10)
    if (Number.isNaN(parsedYear)) {
      resp.status = 400
      resp.data = ['year is invalid']
    } else {
      resp.data = readFile(MOVIES_PATH).filter(
        ({ year }) => year === parsedYear
      )
      if (resp.data.length === 0) resp.status = 404
    }
  } else {
    resp.data = readFile(MOVIES_PATH)
  }
  res.status(resp.status).json(resp.data)
})

router.get('/:id', (req, res) => {
  const parsedId = parseInt(req.params.id, 10)
  if (Number.isNaN(parsedId)) {
    res.status(400).json(['invalid id'])
    return
  }

  const movie = readFile(MOVIES_PATH).find(({ id }) => id === parsedId)
  if (movie === undefined) {
    res.status(404).json(['movie not found'])
  } else {
    res.status(200).json(movie)
  }
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

router.delete('/:id', (req, res) => {
  const parsedId = parseInt(req.params.id, 10)
  if (Number.isNaN(parsedId)) {
    res.status(400).json(['invalid id'])
    return
  }

  const movies = readFile(MOVIES_PATH)
  const newMovies = movies.filter(({ id }) => id !== parsedId)

  if (movies.length === newMovies.length) {
    res.status(404).json([`id ${req.params.id} not found`])
  } else {
    writeFile(MOVIES_PATH, newMovies)
    res.status(200).json(newMovies)
  }
})

router.put('/:id', (req, res) => {
  const parsedId = parseInt(req.params.id, 10)
  if (Number.isNaN(parsedId)) {
    res.status(400).json(['invalid id'])
    return
  }

  const errors = validateSchema(req.body, movieSchema)
  if (errors.length > 0) {
    res.status(400).json(errors)
    return
  }

  const movies = readFile(MOVIES_PATH)
  const newMovies = movies.map((movie) =>
    movie.id === parsedId ? { id: parsedId, ...req.body } : movie
  )

  writeFile(MOVIES_PATH, newMovies)
  res.status(200).json(newMovies)
})

module.exports = router
