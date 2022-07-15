const fs = require('fs')

function readFile(dir) {
  return JSON.parse(fs.readFileSync(dir))
}

function writeFile(dir, data) {
  fs.writeFileSync(dir, JSON.stringify(data))
}

module.exports = { readFile, writeFile }
