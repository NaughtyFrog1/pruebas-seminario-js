function validateName(name) {
  const sanitizedName = String(name).trim().replace(/\s+/g, ' ')

  const errors = []
  if (sanitizedName.length < 3) {
    errors.push('The name is too short')
  } else if (sanitizedName.length > 20) {
    errors.push('The name is too long')
  }
  if (errors.length !== 0) return { ok: false, errors }

  return { ok: true, data: { sanitizedName } }
}

module.exports = { validateName }
