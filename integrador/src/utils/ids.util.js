const { nanoid } = require('nanoid')

function getNewUniqueId(data) {
  let newId = nanoid(11)
  while (data.hasOwnProperty(newId)) newId = nanoid(11)
  return newId
}

module.exports = { getNewUniqueId }
