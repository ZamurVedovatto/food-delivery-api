const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { AuthenticationError, UserInputError } = require('apollo-server')
const { validateRegisterInput, validateLoginInput } = require('./../../util/validators')
const { SECRET_KEY } = require('./../../config')
const User = require('./../../models/User')
const KeyModel = require('./../../models/Key')
const checkAuth = require('./../../util/check-auth')

function generateToken(user) {
  return jwt.sign({
    id: user.id,
    username: user.username,
    email: user.email,
  }, SECRET_KEY, { expiresIn: '4h' })
}

module.exports = {
  Query: {

    // QUERY GET USERS
    async getUsers () {
      try {
        const users = await User.find().sort({ createdAt: -1 })
        return users
      } catch (err) {
        throw new Error(err)
      }
    },


    // QUERY GET USER
    async getUser(_, { userId }) {
      try{
        const user = await User.findById(userId)
        if(user) {
          return user
        } else {
          throw new Error('User not found')
        }
      } catch(err) {
        throw new Error(err)
      }
    },

    // QUERY GET USER
    async getUserFavoritedKeys(_, { userId }) {
      try{
        const user = await User.findById(userId)
        if(user) {
          console.log(user.favoritedKeys)
          const keys = await KeyModel.find({ "_id": { $in: user.favoritedKeys} }).sort({ createdAt: -1 })
          console.log(keys)
          return keys
        } else {
          throw new Error('User not found')
        }
      } catch(err) {
        throw new Error(err)
      }
    },
  },


  Mutation: {
    // REGISTER MUTATION
    async register(_, { registerInput: { username, email, name, password, confirmPassword }}) {
      // validate user data
      const { valid, errors } = validateRegisterInput(username, name, email, password, confirmPassword)
      if(!valid) {
        throw new UserInputError('Errors', { errors })
      }
      // make sure user doesn't already exists
      const userByEmail = await User.findOne({ email })
      if(userByEmail) {
        throw new UserInputError('Email is taken', {
          errors: {
            username: 'This email is taken'
          }
        })
      }
      const user = await User.findOne({ username })
      if(user) {
        throw new UserInputError('Username is taken', {
          errors: {
            username: 'This username is taken'
          }
        })
      }
      // hash password and create auth token
      password = await bcrypt.hash(password, 12)
      const newUser = new User({
        username,
        name,
        email,
        password,
        createdAt: new Date().toISOString()
      })
      const result = await newUser.save()
      const token = generateToken(result)
      return {
        ...result._doc,
        id: result._id,
        token
      }
    },



    // LOGIN MUTATION
    async login(_, { username, password }) {
      const { valid, errors } = validateLoginInput(username, password)
      if(!valid) {
        throw new UserInputError('Errors', { errors })
      }
      const user = await User.findOne({ username })
      if(!user) {
        errors.general = 'User not found'
        throw new UserInputError('User not found', { errors })
      }
      const match = await bcrypt.compare(password, user.password)
      if(!match) {
        errors.general = 'Wrong credentials'
        throw new UserInputError('Wrong credentials', { errors })
      }

      // TODO procurar pelo userId
      const keys = await KeyModel.find({ "username": user.username })
      const token = generateToken(user)

      return {
        user: {
          ...user._doc,
          id: user._id,
          token
        },
        keys,
      }
    },


    async editUser(parent, { editInput }, context) {
      const authenticatedUser = checkAuth(context)
      const doc = editInput;

      if(authenticatedUser.id === doc.id) {
        const user = await User.findById(doc.id);
        if(!user) {
          throw new Error('User not found')
        }

        // TODO check the best way to modify a document
        if(!doc.email) {
          doc.email = user.email;
        }
        if(!doc.username) {
          doc.username = user.username;
        }
        if(!doc.name) {
          doc.name = user.name;
        }
        doc.createdAt = user.createdAt;

        const updatedUser = await User.findByIdAndUpdate(doc.id, doc, {
          new: true
        });

        return updatedUser;
      } else {
        throw new AuthenticationError('Action not allowed')
      }
    },

    // DELETE USER MUTATION
    async deleteUser(_, { userId }, context) {
      const authenticatedUser = checkAuth(context)
      try {
        const user = await User.findById(userId)
        if(authenticatedUser.id == user.id) {
          await user.delete()
          return 'User deleted successfully'
        } else {
          throw new AuthenticationError('Action not allowed')
        }
      } catch(err) {
        throw new Error(err)
      }
    },

    // FAVORITED KEYS
    async favoriteKey(_, { userId, keyId }, context) {
      const key = await KeyModel.findById(keyId)
      const user = await User.findById(userId)

      if(keyId) {
        let index = user.favoritedKeys.indexOf(keyId);
        console.log("index 186", index)
        if (index > -1) {
          console.log("estava nos favoritos")
          user.favoritedKeys.splice(index, 1);
        } else {
          console.log("não estava nos favoritos")
          user.favoritedKeys.push(keyId)
        }
        await user.save()

        console.log(user.favoritedKeys)

        return key
      } else {
        throw new UserInputError('Key not found')
      }
    },
  }
}