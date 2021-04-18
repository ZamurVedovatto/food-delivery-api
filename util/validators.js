module.exports.validateRegisterInput = (
  username,
  name,
  email,
  password,
  confirmPassword
) => {
  const errors = {}
  if (username.trim() === '') {
    errors.username = 'Username must not be empty'
  }
  if (name.trim() === '') {
    errors.name = 'Name must not be empty'
  }
  if (email.trim() === '') {
    errors.email = 'Email must not be empty'
  } else {
    const regEx = /^([0-9a-zA-Z]([-.\w]*[0-9a-zA-Z])*@([0-9a-zA-Z][-\w]*[0-9a-zA-Z]\.)+[a-zA-Z]{2,9})$/
    if (!email.match(regEx)) {
      errors.email = 'Email must be a valid email address'
    }
  }
  if (password === '') {
    errors.password = 'Password must not empty'
  } else if (password !== confirmPassword) {
    errors.confirmPassword = 'Passwords must match'
  }
  return {
    errors,
    valid: Object.keys(errors).length < 1
  }
}

module.exports.validateLoginInput = (username, password) => {
  const errors = {}
  if (username.trim() === '') {
    errors.username = 'Username must not be empty'
  }
  if (password.trim() === '') {
    errors.password = 'Password must not be empty'
  }
  return {
    errors,
    valid: Object.keys(errors).length < 1
  }
}

module.exports.validateProductInput = (title, description, price) => {
  const errors = {}
  if(title.trim() === '') {
    errors.type = 'title must not be empty'
  }
  if(description.trim() === '') {
    errors.type = 'description must not be empty'
  }
  if(price.trim() === '') {
    errors.type = 'price must not be empty'
  }
  return {
    errors,
    valid: Object.keys(errors).length < 1
  }
}
