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
	type Product {
		id: ID!
		title: String!,
		description: String!,
		price: String!,
		active: Boolean!
		image: ID!
	}
  type User {
    id: ID!
    name: String
    username: String
    email: String
    token: String
    createdAt: String
  }
  type LoggedUser {
    user: User!
  }

  type Query {
		getProducts: [Product!]
    getProduct(productId: ID!): Product!

    getUsers: [User!]
    getUser(userId: ID!): User!
  }
  type Mutation {
    createProduct(title: String, description: String, price: String): Product!
    deleteProduct(productId: ID!): String!
    toggleActiveProduct(productId: ID!): Product!

    register(registerInput: RegisterInput): User!
    login(username: String!, password: String!): LoggedUser!
    editUser(editInput: UserEditInput): User!
    deleteUser(userId: ID!): String!
  }
`

module.exports = typeDefs;
