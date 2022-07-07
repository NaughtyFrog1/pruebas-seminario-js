const tests = [
  // ✅ VALIDO. Todos los campos y todos correctos
  { name: 'John Doe', age: '21', phone: '123-456-7890' },

  // ✅ VALIDO. Todos los campos obligatorios correctos y sin opcionales
  { name: 'John Doe', age: '21' },

  // ❌ ERROR. Campo obligatorio 'age' incorrecto
  { name: 'John Doe', age: 'ERROR', phone: '123-456-7890' },     
  
  // ❌ ERROR. Campo opcional 'phone' incorrecto
  { name: 'John Doe', age: '21', phone: 'ERROR' },   

  // ❌ ERROR. Falta campo obligatorio 'age'
  { name: 'John Doe', phone: '123-456-7890' },

  // ❌ ERROR. Hay campos de más
  { name: 'John Doe', age: '21', phone: '123-456-7890', date: Date.now() },
]

const schema = {
  name: (value) => /^([A-Z][a-z\-]* )+[A-Z][a-z\-]*( \w+\.?)?$/.test(value),
  age: (value) => parseInt(value) === Number(value) && value >= 18,
  phone: (value) => /^(\+?\d{1,2}-)?\d{3}-\d{3}-\d{4}$/.test(value),
}
schema.name.required = true
schema.age.required = true
schema.phone.required = false

function validate(object, schema) {
  const errors = []

  // Validar que no haya campos que no existan en el esquema
  Object.keys(object).forEach((key) => {
    if (!Object.keys(schema).includes(key))
      errors.push(`${key} is not part of schema`)
  })

  // Validar que las claves sean válidas
  Object.entries(schema).forEach(([key, validate]) => {
    if (validate.required && !object.hasOwnProperty(key)) {
      errors.push(`${key} is requiered`)
    } else if (object.hasOwnProperty(key) && !validate(object[key])) {
      errors.push(`${key} is invalid`)
    }
  })

  return errors
}

tests.forEach((test) => console.log(validate(test, schema)))
