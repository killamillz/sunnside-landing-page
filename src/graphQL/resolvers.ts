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
              getUsers: async () => {
                     try {
                            const users = User.find({})

                            return users
                     } catch (error) {
                            console.log(error)
                     }
              },
              getUser: async (_: unknown, _id: String) => {
                     try {
                            const users = await User.findOne({ _id: _id })
                            return users
                     } catch (error) {
                            console.log(error)
                     }
              },
              getBooks: async () => {
                     try {
                            const books = await Book.find({})
                            return books
                     } catch (error) {
                            console.log(error)
                     }
              },
              getBook: async (_: unknown, _id: String) => {
                     try {
                            const book = await Book.findOne({ _id: _id })
                            return book
                     } catch (error) {
                            console.log(error);

                     }
              }

       },
       Mutation: {
              createUser: async (_: unknown, args: any) => {
                     try {
                            const {email, firstName, lastName } = args.user
                     const user = await User.findOne({email})
                     const salt = await SaltGenerator()
                     const password = await passwordGenerator(lastName)
                     const hashedPassword = await hashPassword(password, salt)
                     if (!user) {
                            let newUser = await User.create({
                                   firstName,
                                   lastName,
                                   email,
                                   password: hashedPassword
                            })
                            const mainUser = await User.findOne({ email })
                            if (mainUser) {
                                   const html = emailHtml(email, password)
                                   await sendmail(`${process.env.GMAIL_USER}`, email, 'welcome', html)
                                   return mainUser
                            }
                            return newUser
                     }
                     } catch (error) {
                            console.log(error)
                     }
              },
              loginUser: async (_: unknown, args: any, ) => {
                     try {
                            const users = args.user
                     const error = userSchema2.safeParse(users);
                     
                     if(error.success === true){
                            const { email, _id , password } = args.user
                            const user = await User.findOne({email})

                            if(user){
                                   const validate = await bcrypt.compare(password, user.password)

                                   if(validate){
                                          const token = await tokenGenerator (`${_id}`)
                                          console.log("user",user, "token",token)
                                          return {
                                                 user,
                                                 token
                                          }
                                   }

              
                            }
                     }
                     } catch (error) {
                            console.log(error);
                     }
              },
              updateUser: async (_: unknown, args: any) => {
                     try {
                     //        const user = args.user
                     // const error = userSchema.safeParse(user);
                     // if(error.success === false){
                     //        throw new GraphQLError('User is not authenticated', {
                     //               extensions: {
                     //               code: 'UNAUTHENTICATED',
                     //               http: { status: 401 },
                     //                      },
                     // });
                     // };

              
              
                     const { _id, firstName, lastName, email, password, gender} = args.user
                     const salt = await SaltGenerator()
                     const passwords = await passwordGenerator(password)
                     const hashedPassword = await hashPassword(passwords, salt)
                            
                     const ifUser = await User.findOneAndUpdate({_id}, { firstName, lastName, email, password: hashPassword, gender } )
       
                            console.log(ifUser)
                     if(!ifUser){
                       // This runs when there is no book found using the Id to search
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
                     
              }
              


       }

}
