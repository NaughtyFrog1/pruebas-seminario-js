const fs = require('fs')

function readFile(dir) {
  return JSON.parse(fs.readFileSync(dir))
}

function writeFile(dir, data) {
  fs.writeFileSync(dir, JSON.stringify(data))
}

function validateSchema(object, schema) {
  const errors = []

  // Validar que no haya campos que no existan en el esquema
  Object.keys(object).forEach((key) => {
    if (!Object.keys(schema).includes(key))
      errors.push(`${key} is not part of schema`)
  })

  // Validar que las claves sean válidas
  Object.entries(schema).forEach(([key, validate]) => {
    if (validate.required && !object.hasOwnProperty(key)) {
      errors.push(`${key} is required`)
    } else if (object.hasOwnProperty(key) && !validate(object[key])) {
      errors.push(`${key} is invalid`)
    }
  })

  return errors
}

module.exports = { readFile, writeFile, validateSchema }
