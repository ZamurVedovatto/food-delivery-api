const gql = require('graphql-tag')

const typeDefs = gql `
  input RegisterInput {
    username: String!
    password: String!
    name: String!
    confirmPassword: String!
    email: String!
  }
  input UserEditInput {
    id: String
    email: String
    username: String
    name: String
    createdAt: String
  }
  input AddressInput {
    userId: ID!
    code: String!
    type: String
    street: String
    number: String
    complement: String
    neighborhood: String
    city: String
    country: String
  }
  type Address {
    id: ID!
    code: String
    type: String
    street: String
    number: String
    complement: String
    neighborhood: String
    city: String
    country: String
    userId: ID!
    asKey: Boolean!
  }
  type User {
    id: ID!
    name: String
    username: String
    email: String
    favoritedKeys: [Key!]
    token: String
    createdAt: String
  }
  type Key{
    id: ID!
    type: String!
    confirmed: Boolean
    active: Boolean
    createdAt: String
    userId: ID!
    username: String
    title: String!
    address: ID
  }
  type LoggedUser {
    user: User!
    keys: [Key]
  }
  type Message {
    id: ID!
    modality: String,
    targetKey: String!,
    body: String!,
    senderId: ID!,
    senderKey: String!,
    read: Boolean!,
    received: Boolean!,
    createdAt: String!
    comments: [Comment]!
    commentCount: Int!
    likes: [Like]!
    likeCount: Int!
  }
  type Comment {
    id: ID!
    createdAt: String!
    username: String!
    body: String!
  }
  type Like {
    id: ID!
    createdAt: String!
    username: String!
  }

  type Query {
    getUsers: [User!]
    getUser(userId: ID!): User!
    getUserKeys(userId: ID!): [Key!]
    getUserFavoritedKeys(userId: ID!): [Key!]

    getKeys: [Key!]
    getKey(keyId: ID!): Key!

    getAddresses: [Address!]!
    getUserAddresses(userId: ID!): [Address!]!
    getAddress(id: ID!): Address!
    
    getMessages: [Message!]
    getMessage(messageId: ID!): Message!
    getUserReceivedMessages(userId: ID!): [Message!]
    getUserSentMessages(userId: ID!): [Message!]
  }
  type Mutation {
    register(registerInput: RegisterInput): User!
    login(username: String!, password: String!): LoggedUser!
    editUser(editInput: UserEditInput): User!
    deleteUser(userId: ID!): String!
    favoriteKey(userId: ID!, keyId: ID!): Key!
    
    createMessage(modality: String!, targetKey: String!, body: String!, senderKey: String!): Message!
    deleteMessage(messageId: ID!): String!
    likeMessage(messageId: ID!): Message!
    readMessage(messageId: ID!): Message!
    createComment(messageId: String!, body: String!): Message!
    deleteComment(messageId: ID!, commentId: ID!): Message!

    createKey(userId: ID!, username: String!, type: String!, title: String, addressInput: AddressInput): Key!
    deleteKey(userId: ID!, keyId: ID!): String!
    toggleActiveKey(userId: ID!, keyId: ID!): Key!

    createAddress(addressInput: AddressInput!): Address!
    deleteAddress(userId: ID!, addressId: ID!): String!
    setAddressAsKey(addressId: ID!): Address!
  }
  type Subscription{
    # newPost: Post!
    newMessage: Message!
  }
`

module.exports = typeDefs;