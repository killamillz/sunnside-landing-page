"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.typeDefs = void 0;
exports.typeDefs = `#graphql

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
              pageCount: Int!
              datePublished: String
              description: String!
              genre: String
              Publisher: String
       }


       type UserOne {
              user: User
              token: String!
       }

       
       input CreateUserInput {
              firstName: String!
              lastName: String!
              email: String!
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
              id:String
              author: String!
              pageCount: String!
              datePublished: String!
              description: String!
              genre: String!
       }
       
       input UpdateBookInput {
              id: String
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
              loginUser(user: LoginUserInput!): UserOne!
              updateUser(user: UpdateUserInput!) : User
              deleteUser(id: String): User!
              createBook(book: CreateBookInput!): Book!
              updateBook(book: UpdateBookInput): Book!
              deleteBook(id: String): Book!
       }


`;
