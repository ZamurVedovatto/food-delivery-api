const addressResolvers = require('./address')
const commentResolvers = require('./comments')
const keysResolvers = require('./keys')
const messagesResolvers = require('./messages')
const usersResolvers = require('./users')

module.exports = {
  Message: {
    commentCount: (parent) =>  parent.comments.length,
    likeCount: (parent) => parent.likes.length,
  },
  Query: {
    ...addressResolvers.Query,
    ...keysResolvers.Query,
    ...messagesResolvers.Query,
    ...usersResolvers.Query,
  },
  Mutation: {
    ...addressResolvers.Mutation,
    ...commentResolvers.Mutation,
    ...keysResolvers.Mutation,
    ...messagesResolvers.Mutation,
    ...usersResolvers.Mutation,
  },
  Subscription: {
    ...messagesResolvers.Subscription,
  }
}