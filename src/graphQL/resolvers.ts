import { UnknownError } from "http-errors"
import User from "../models/userModels"
import Book from "../models/bookModels"
import { userSchemaBooks, userSchema2, userSchema } from "../validation/validation"
import { SaltGenerator, passwordGenerator, hashPassword, tokenGenerator } from "../utilities/utility"
import { sendmail, emailHtml } from "../utilities/notification";
import bcrypt from "bcryptjs"
import {GraphQLError} from 'graphql'




export const resolvers = {

       Query: {
              getUsers: async (_:unknown, args: unknown, context: any) => {
                     try {
                            if(!context.decoded){
                                   throw new GraphQLError('User is not authenticated', {
                                          extensions: {
                                          code: 'UNAUTHENTICATED',
                                          http: { status: 401 },
                                          },
                                   });
              
                            }
                            const users = User.find({})

                            return users
                     } catch (error) {
                            console.log(error)
                     }
              },
              getUser: async (_: unknown, _id: String, context: any) => {
                     try {
                            if(!context.decoded){
                                   throw new GraphQLError('User is not authenticated', {
                                          extensions: {
                                          code: 'UNAUTHENTICATED',
                                          http: { status: 401 },
                                          },
                                   });
              
                            }

                            const users = await User.findOne({ _id: _id })
                            return users
                     } catch (error) {
                            console.log(error)
                     }
              },
              getBooks: async (_:unknown, args: unknown, context: any) => {
                     try {
                            if(!context.decoded){
                                   throw new GraphQLError('User is not authenticated', {
                                          extensions: {
                                          code: 'UNAUTHENTICATED',
                                          http: { status: 401 },
                                          },
                                   });
              
                            }
                            const books = await Book.find({})
                            return books
                     } catch (error) {
                            console.log(error)
                     }
              },
              getBook: async (_: unknown, _id: String, context:any) => {
                     try {  if(!context.decoded){
                            throw new GraphQLError('User is not authenticated', {
                                   extensions: {
                                   code: 'UNAUTHENTICATED',
                                   http: { status: 401 },
                                   },
                            });
       
                     }
                            const book = await Book.findOne({ _id: _id })
                            return book
                     } catch (error) {
                            console.log(error);

                     }
              }

       },
       Mutation: {
              createUser: async (_: unknown, args: any, context: any) => {
                     try {
                            if(!context.id){
                                   const {email, firstName, lastName } = args.user
                            const user = await User.findOne({email})
                            const salt = await SaltGenerator()
                            const password = await passwordGenerator(lastName)
                            const hashedPassword = await hashPassword(password, salt)


                            if (user) {
                                   throw new GraphQLError('User already exists', {
                                          extensions: {
                                          code: 'UNAUTHENTICATED',
                                          http: { status: 401 },
                                          },
                                   });
                            }
                            let newUser = await User.create({
                                   firstName,
                                   lastName,
                                   email,
                                   password: hashedPassword,
                                   createdAt: new Date(),
                                   updatedAt: new Date()
                            })


                            const mainUser = await User.findOne({ email })


                            if (!mainUser) {
                                   throw new GraphQLError('User was not created', {
                                          extensions: {
                                          code: 'UNAUTHENTICATED',
                                          http: { status: 401 },
                                          },
                                   });
                            }


                            const html = emailHtml(email, password)
                            await sendmail(`${process.env.GMAIL_USER}`, email, 'welcome', html)
                            
                            return newUser
                            }
                            
                     } catch (error) {
                            console.log(error)
                     }
              },
              loginUser: async (_: unknown, args: any) => {
                     try {
                            // if(context.decoded){
                            //        throw new GraphQLError('User is not authenticated', {
                            //               extensions: {
                            //               code: 'UNAUTHENTICATED',
                            //               http: { status: 401 },
                            //               },
                            //        });
              
                            // }

                            const users = args.user
                            const error = userSchema2.safeParse(users);
                                   
                            if(error.success === false){
                                   throw new GraphQLError('User input not completely filled', {
                                          extensions: {
                                          code: 'UNAUTHENTICATED',
                                          http: { status: 401 },
                                          },
                                   });
                            }

                            const { email, _id , password } = args.user
                            const user = await User.findOne({email})
                            
                            if(!user){
                                   throw new GraphQLError(`Invalid email address`, {
                                          extensions: {
                                          code: 'UNAUTHENTICATED',
                                          http: { status: 401 },
                                          },
                                   });
                            }
                                   const validate = await bcrypt.compare(password, user.password)
                                   if(!validate){
                                          throw new GraphQLError('Incorrect password', {
                                                 extensions: {
                                                 code: 'UNAUTHENTICATED',
                                                 http: { status: 401 },
                                                 },
                                          });
                                   }
                                   const token = await tokenGenerator (_id)
                                   
                                   return {token}
                                   
                     
                     }catch (error) {
                            console.log(error);
                     }
              },
              updateUser: async (_: unknown, args: any, context:any) => {
                     try {
                            if(!context.decoded){
                                   throw new GraphQLError('User is not authenticated', {
                                          extensions: {
                                          code: 'UNAUTHENTICATED',
                                          http: { status: 401 },
                                          },
                                   });
              
                            }
                            const user = args.user
                     const error = userSchema.safeParse(user);
                     if(error.success === false){
                            throw new GraphQLError('User is not authenticated', {
                                   extensions: {
                                   code: 'UNAUTHENTICATED',
                                   http: { status: 401 },
                                   },
                            });
                     };

              
              
                     const { _id, firstName, lastName, email, password, gender} = args.user
                     const salt = await SaltGenerator()
                     const passwords = await passwordGenerator(password)
                     const hashedPassword = await hashPassword(passwords, salt)
                            
                     const ifUser = await User.findOneAndUpdate({_id}, { firstName, lastName, email, password: hashedPassword, gender } )
       
                            console.log(ifUser)
                     if(!ifUser){
                      
                            throw new GraphQLError('User not found', {
                                   extensions: {
                                   code: 'UNAUTHENTICATED',
                                   http: { status: 401 },
                                          },
                            });
                     };

                     //if book is found then we would find and update using the mongodb query 
                     
                     return ifUser 
                     } catch (error) {
                            console.log(error)
                     }
                     
              },
              deleteUser: async (_:unknown, args: any, context: any) => {

                     try {
                            if(!context.decoded){
                                   throw new GraphQLError('User is not authenticated', {
                                          extensions: {
                                          code: 'UNAUTHENTICATED',
                                          http: { status: 401 },
                                          },
                                   });
              
                            }
                            const  _id  = args.id
                            const user = await User.findByIdAndDelete(_id)
                            if(!user){
                                   throw new GraphQLError('User does not exist', {
                                          extensions: {
                                          code: 'UNAUTHENTICATED',
                                          http: { status: 404 },
                                                 },
                                   });
                            }
                     
              
                     return user
                     } catch (error) {
                            console.log(error);
                     }
              },

              createBook: async (_: unknown, args: any, context: any) => {
                     try {

                            if(!context.decoded){
                                   throw new GraphQLError('User is not authenticated', {
                                          extensions: {
                                          code: 'UNAUTHENTICATED',
                                          http: { status: 401 },
                                          },
                                   });
              
                            }
                            const book = args.book
                            const error = userSchemaBooks.safeParse(book);
                     
                            if(error.success === false){
                                   
                                   throw new GraphQLError('Input undefined', {
                                          extensions: {
                                          code: 'ERROR',
                                          http: { status: 404 },
                                                 },
                                   });
                            }
                     
                            const {title, author, datePublished, description, pageCount, genre, Publisher} = args.book
                            const existingBook = await Book.findOne({title})

                            if(existingBook){
                                   throw new GraphQLError('Book title exists already', {
                                          extensions: {
                                          code: 'ERROR',
                                          http: { status: 404 },
                                          },
                                   });
                            }
                            let newBook = await Book.create({
                                   title,
                                   author, 
                                   datePublished, 
                                   description, 
                                   pageCount, 
                                   genre,
                                   Publisher,
                                   createdAt: new Date(),
                                   updatedAt: new Date()
                            });

                            return newBook
                     } catch (error) {
                            console.log(error);
                     }

                     
              }, 
              updateBook: async (_: unknown, args:any, context: any) => {

                     try {  
                            if(!context.decoded){
                                   throw new GraphQLError('User is not authenticated', {
                                          extensions: {
                                          code: 'UNAUTHENTICATED',
                                          http: { status: 401 },
                                          },
                                   });
              
                            }
                            const books = args.book
                            const error = userSchemaBooks.safeParse(books);
                     
                            if(error.success === false){
                                   throw new GraphQLError('missing input check requirement', {
                                          extensions: {
                                          code: 'ERROR',
                                          http: { status: 404 },
                                                 },
                                   });
                            };
                            const { id, title, author, datePublished, description, pageCount, genre, Publisher } = args.book
                            
                            const ifBook = await Book.findByIdAndUpdate(id, { title, author, datePublished, description, pageCount, genre, Publisher })

                            if(!ifBook){
                                   throw new GraphQLError('Book not found', {
                                          extensions: {
                                          code: 'ERROR',
                                          http: { status: 404 },
                                          },
                                   });
                            };
                            
                            return ifBook
                     } catch (error) {
                            console.log(error);
                     }
                     

              },

              deleteBook: async (_: unknown, args: any, context: any) => {
                     try {
                            if(!context.decoded){
                                   throw new GraphQLError('User is not authenticated', {
                                          extensions: {
                                          code: 'UNAUTHENTICATED',
                                          http: { status: 401 },
                                          },
                                   });
              
                            }
                            const  _id  = args.id
                            const book = await Book.findByIdAndDelete(_id)
       
                            if(!book){
                                   throw new GraphQLError('Book not found', {
                                          extensions: {
                                          code: 'ERROR',
                                          http: { status: 404 },
                                                 },
                                   });
                            }
       
                            return book
                     } catch (error) {
                            console.log(error);
                     }
                     
              }
       }

}
