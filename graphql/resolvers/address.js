const { AuthenticationError, UserInputError } = require('apollo-server')
const { validateKeyInput } = require('./../../util/validators')
const checkAuth = require('./../../util/check-auth')
const AddressModel = require('./../../models/Address')
const cepPromise = require('cep-promise')

module.exports = {
  Query: {
    async getAddresses () {
      try {
        const data = await AddressModel.find().sort({ createdAt: -1 })
        return data
      } catch (err) {
        throw new Error(err)
      }
    },
    async getUserAddresses(_, { userId }) {
      try {
        const data = await AddressModel.find({ userId })
        return data
      } catch (error) {
        throw new Error(error)
      }
    },
    async getAddress(_, { id }) {
      try {
        const data = await AddressModel.findOne( {"_id": id })
        if(data) return data
        else throw new Error('Address not found')
      } catch (error) {
        throw new Error(error)
      }
    }
  },

  Mutation: {
    async createAddress(_, { addressInput: {
        userId,
        code,
        type,
        street,
        number,
        complement,
        neighborhood,
        city,
        country,
      }}, context) {
      // const authenticatedUser = checkAuth(context)
      try {
        // TODO check authenticated user
        // TODO validate inputs
        // TODO make sure user doesn't already exists

        console.log(userId,
          code,
          type,
          street,
          number,
          complement,
          neighborhood,
          city,
          country)

        const newAddress = new AddressModel({
          userId,
          code,
          type,
          street,
          number,
          complement,
          neighborhood,
          city,
          country,
          createdAt: new Date().toISOString()
        })

        console.log(newAddress)

        const data = await newAddress.save()
        return data

      } catch(err) {
        throw new Error(err)
      }
    },

    async deleteAddress(_, { userId, addressId }, context) {
      const authenticatedUser = checkAuth(context)
      try {
        if(authenticatedUser.id == userId) {
          try {
            const data = await AddressModel.findOne({ "_id": addressId })
            await data.delete()
            return 'Address deleted successfully'
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


    async setAddressAsKey(_, { addressId }, context) {
      console.log("addressId", addressId)
      const addressSelected = await AddressModel.findById(addressId)
      if(addressSelected) {
        addressSelected.asKey = !addressSelected.asKey
        console.log("addressSelected.asKey" , addressSelected.asKey)
        await addressSelected.save()
        return addressSelected
      } else {
        throw new UserInputError('Address not found')
      }
    }
  }
}