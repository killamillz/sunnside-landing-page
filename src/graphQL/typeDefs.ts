
export const typeDefs = `#graphql

       type User {
              firstName: String!
              lastName: String!
              email: String!
              password: String
              gender: String
              }


       type Book {
              title: String!
              author: String!
              pageCount: String!
              datePublished: String
              description: String!
              genre: String
              Publisher: String
       }

       type Token {
              token: String
       }

       
       input CreateUserInput {
              firstName: String!
              lastName: String!
              email: String!
              gender: String!
       }

       input UpdateUserInput{
              _id: ID!
              firstName: String
              lastName: String
              email:String
              password:String
              gender: String
       }

       input CreateBookInput {
              title: String
              author: String!
              pageCount: String!
              datePublished: String!
              description: String!
              genre: String!
              Publisher: String
       }
       
       input UpdateBookInput {
              id: ID
              title: String
              author: String
              pageCount: String
              datePublished: String
              description: String
              genre: String
              Publisher: String
       }

       input LoginUserInput {
              email: String!
              password: String!
       }

       type Query {
              getUsers: [User]!
              getUser(_id: ID!): User!
              getBooks: [Book]!
              getBook(_id: ID!): Book!
       }


       type Mutation {
              createUser(user: CreateUserInput!): User!
              loginUser(user: LoginUserInput!): Token
              updateUser(user: UpdateUserInput!) : User
              deleteUser(id: ID!): User!
              createBook(book: CreateBookInput!): Book!
              updateBook(book: UpdateBookInput): Book!
              deleteBook(id: String): Book!
       }


`



