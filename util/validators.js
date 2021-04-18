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

module.exports.validateKeyInput = (type, title) => {
  const errors = {}
  if(type.trim() === '') {
    errors.type = 'Type must not be empty'
  }
  if (type === 'plate' && title.trim() === '') {
    errors.type = 'Plate must not be empty'
  } 
  return {
    errors,
    valid: Object.keys(errors).length < 1
  }
}