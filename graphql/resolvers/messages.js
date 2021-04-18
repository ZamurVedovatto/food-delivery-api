const { AuthenticationError, UserInputError } = require('apollo-server')

const Message = require('./../../models/Message')
const KeyModel = require('./../../models/Key')
const checkAuth = require('./../../util/check-auth')

module.exports = {
  Query: {
    async getMessages () {
      try {
        const messages = await Message.find().sort({ createdAt: -1 })
        return messages
      } catch (err) {
        throw new Error(err)
      }
    },

    async getMessage(_, { messageId }) {
      try{
        const message = await Message.findById(messageId)
        if(message) {
          return message
        } else {
          throw new Error('Message not found')
        }
      } catch(err) {
        throw new Error(err)
      }
    },

    async getUserReceivedMessages(_, { userId }, context) {
      const authenticatedUser = checkAuth(context)
      try{
        if(authenticatedUser.id == userId) {
          const keys = await KeyModel.find({"userId": userId}).sort({ createdAt: -1 })
          const keysTitle = keys.map(key => key.title)
          const messages = await Message.find({ "targetKey": { $in: keysTitle} }).sort({ createdAt: -1 })
          if(messages) {
            messages.forEach(async (msg) => {
              msg.received = true
              await msg.save()
            })
            return messages
          } else {
            throw new Error('Messages not found')
          }
        } else {
          throw new AuthenticationError('Action not allowed')
        }

      } catch(err) {
        throw new Error(err)
      }
    },

    async getUserSentMessages(_, { userId }, context) {
      const authenticatedUser = checkAuth(context)
      console.log(authenticatedUser.id == userId)
      try{
        if(authenticatedUser.id == userId) {
          const messages = await Message.find({ "senderId": userId }).sort({ createdAt: -1 })
          if(messages) {
            return messages
          } else {
            throw new Error('Messages not found')
          }
        } else {
          throw new AuthenticationError('Action not allowed')
        }
      } catch(err) {
        throw new Error(err)
      }
    },
  },


  Mutation: {
    async createMessage(_, { modality, targetKey, body, senderKey }, context) {
      console.log(modality, targetKey, body, senderKey)
      const user = checkAuth(context)
      if (body.trim() === '') { // change it to validators file
        throw new Error('Message body must not be empty')
      }
      const newMessage = new Message({
        modality,
        targetKey,
        body,
        senderKey,
        senderId: user.id,
        createdAt: new Date().toISOString()
      })
      const message = await newMessage.save()
      // context.pubsub.publish('NEW_MESSAGE', {
      //   newMessage: message
      // })
      return message
    },

    async deleteMessage(_, { messageId }, context) {
      const user = checkAuth(context)
      try {
        const message = await Message.findById(messageId)
        if(user.username == message.username) {
          await message.delete()
          return 'Message deleted successfully'
        } else {
          throw new AuthenticationError('Action not allowed')
        }
      } catch(err) {
        throw new Error(err)
      }
    },

    async likeMessage(_, { messageId }, context) {
      const { username } = checkAuth(context)
      const message = await Message.findById(messageId)
      if(message) {
        if(message.likes.find(like => like.username === username)){
          // message already like, unlike it
          message.likes = message.likes.filter(like => like.username !== username)
        } else {
          // no liked message, do the like
          message.likes.push({
            username,
            createdAt: new Date().toISOString()
          })
        }
        await message.save()
        return message
      } else {
        throw new UserInputError('Message not found')
      }
    },


    async readMessage(_, { messageId }, context) {
      const message = await Message.findById(messageId)
      if(message) {
        message.read = true;
        await message.save()
        return message
      } else {
        throw new UserInputError('Message not found')
      }
    }

  },
  Subscription: {
    newMessage: {
      subscribe: (_, __, { pubsub }) => pubsub.asyncIterator('NEW_MESSAGE')
    }
  }
}