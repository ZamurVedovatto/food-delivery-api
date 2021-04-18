const { UserInputError, AuthenticationError } = require('apollo-server')
const checkAuth = require('../../util/check-auth')
const Message = require('./../../models/Message')

module.exports = {
  Mutation: {
    createComment: async (_, { messageId, body }, context) => {
      const { username } = checkAuth(context)
      if (body.trim() === ''){
        throw UserInputError('Empty comment', {
          errors: {
            body: 'Comment body must be not empty'
          }
        })
      }
      const message = await Message.findById(messageId)
      if(message) {
        message.comments.unshift({
          body,
          username,
          createdAt: new Date().toISOString()
        })
        await message.save()
        return message
      } else {
        throw new UserInputError('Message not found')
      }
    },

    deleteComment: async(_, { messageId, commentId }, context) => {
      const { username } = checkAuth(context);
      const message = await Message.findById(messageId)
      if(message) {
        const commentIndex = message.comments.findIndex(c => c.id === commentId)
        if (message.comments[commentIndex].username === username) {
          message.comments.splice(commentIndex, 1)
          await message.save()
          return message
        } else {
          throw new AuthenticationError('Action not allowed')
        }
      } else {
        throw new UserInputError('Message not found')
      }
    }
  }
}