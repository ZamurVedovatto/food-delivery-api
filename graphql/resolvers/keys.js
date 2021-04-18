const { AuthenticationError, UserInputError } = require('apollo-server')
const { validateKeyInput } = require('./../../util/validators')
const checkAuth = require('./../../util/check-auth')
const KeyModel = require('./../../models/Key')
const AddressModel = require('./../../models/Address')

module.exports = {
  Query: {
    async getKeys () {
      try {
        const keys = await KeyModel.find().sort({ createdAt: -1 })
        return keys
      } catch (err) {
        throw new Error(err)
      }
    },
    async getUserKeys(_, { userId }) {
      try {
        const keys = await KeyModel.find({ userId })
        return keys
      } catch (error) {
        throw new Error(error)
      }
    },
    async getKey(_, { keyId }) {
      try {
        const key = await KeyModel.findOne( {"_id": keyId })
        if(key) return key
        else throw new Error('Key not found')
      } catch (error) {
        throw new Error(error)
      }
    }
  },

  Mutation: {
    async createKey(_, {
      userId,
      username,
      type,
      title,
      addressInput
    }, context) {
      const authenticatedUser = checkAuth(context)
      try {
        if(authenticatedUser.id == userId) {
          const { valid, errors } = validateKeyInput(type, title)
          if(!valid) {
            throw new UserInputError('Errors', { errors })
          }
          // make sure user doesn't already exists
          const findKey = await KeyModel.findOne({ title })
          if(findKey) {
            throw new UserInputError('Key is taken', {
              errors: {
                key: 'This key is taken'
              }
            })
          }

          if(type === 'address') {
            const newAddress = new AddressModel(addressInput)
            console.log(newAddress)
          }

          // const newKey = new KeyModel({
          //   type,
          //   userId,
          //   username,
          //   title,
          //   address,
          //   createdAt: new Date().toISOString()
          // })
          // return await newKey.save()
        } else {
          throw new AuthenticationError('Action not allowed')
        }
      } catch(err) {
        throw new Error(err)
      }
    },

    async deleteKey(_, { userId, keyId }, context) {
      const authenticatedUser = checkAuth(context)
      try {
        if(authenticatedUser.id == userId) {
          try {
            const key = await KeyModel.findOne({ "_id": keyId })
            await key.delete()
            return 'Key deleted successfully'
          } catch(err) {
            throw new Error(err)
          }
        } else {
          throw new AuthenticationError('Action not allowed')
        }
      } catch(err) {
        throw new Error(err)
      }
    },

    async toggleActiveKey(_, { userId, keyId }, context) {

      console.log("userId, keyId", userId, keyId)

      const authenticatedUser = checkAuth(context)
      try {
        if(authenticatedUser.id == userId) {
          const selectedKey = await KeyModel.findById(keyId)
          if(selectedKey) {
            selectedKey.active = !selectedKey.active
            console.log("selectedKey.active" , selectedKey.active)
            await selectedKey.save()
            return selectedKey
          } else {
            throw new UserInputError('Key not found')
          }
        } else {
          throw new AuthenticationError('Action not allowed')
        }
      } catch(err) {
        throw new Error(err)
      }
    }
  }
}