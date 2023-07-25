

import { Request, Response, NextFunction} from 'express';
import User from "../models/userModels";
import { SaltGenerator, passwordGenerator, hashPassword, tokenGenerator} from  "../utilities/utility"
import { sendmail, emailHtml } from "../utilities/notification";
import bcrypt from "bcryptjs";
import { userSchema2 } from "../validation/validation";
import dotenv from "dotenv"


dotenv.config()

export const createUser = async ( req:Request, res:Response )=>{
     // import from the frontend
     // use the mongoose to find the email


     try{
          const { firstName, lastName, email } = req.body;
          const findUser = await User.findOne({email})

          if(findUser){
               return res.status(404).json({
                    message: `User already exists`, 
                    status: `Error`
               })
          }

          const salt = await SaltGenerator()

          const password = await passwordGenerator(lastName)

          const hashedPassword = await hashPassword(password, salt)
     
          if(!findUser){
               let newUser = await User.create({
                    firstName,
                    lastName,
                    email,
                    password: hashedPassword
               })

               const mainUser = await User.findOne({email})
               

               if(mainUser){
                    const html = emailHtml(email, password)
                    await sendmail(`${process.env.GMAIL_USER}`, email, 'welcome', html)
                    return res.status(200).json({
                         message: `User created successfully`
                    })

               }
               return res.status(401).json({
                    message: `Unable to create user`
               })
          }
     }catch(err){
          return res.status(500).json({
               message:  `Internal server error`,
               status: "Error"
          })
     }
}




export const login = async(req: Request, res: Response, next: NextFunction)=>{
     try {
          const users = req.body

          const error = userSchema2.safeParse(users);
          if(error.success === false){
               return res.status(400).send({
                    status: "Error",
                    message: error.error.issues[0].message
               })

          }

          const { email } = req.body
          const user = await User.findOne({email})

          if(!user){
               return res.status(404).json({
                    message: `User with ${users.email} not found`
               })
          }

          if(user){
               const validate = await bcrypt.compare(users.password, user.password)

               if(!validate){
                    return res.status(400).json({
                         message: `invalid password`
                    })
               }
          

               if(validate){
                    const token = await tokenGenerator (`${user._id}`)
                    res.cookie('token', token)
                    return res.status(200).json({
                         message: "login successful",
                         email: user.email,
                         
                    })
               }

          }
     } catch (error) {
          return res.status(500).json({
               message: `Internal server error`
          })
     }
}




export const getAllUsers = async(req: Request, res: Response)=>{
     try {
          const allUSers = await User.find({})

          if(!allUSers){
               return res.status(404).json({
                    message: `Error getting all users`
               })
          }

          if(allUSers){
               return res.status(200).json({
                    message: `Users gotten successfully`,
                    allUSers
               })
          }
     } catch (error) {
          return res.status(500).json({
               message: `Internal service error`
          })
          
     }
}


export const getSingleUser = async(req: Request, res: Response)=>{
     try{
          const {email} = req.body

          const user = await User.findOne({email}, {password:0})

          if(!user){
               return res.status(404).json({
                    message:`User not found`,
                    status: `failed`
               })
          }


          if(user){
               return res.status(200).json({
                    message: `User fetched successfully`,
                    user
               })
          }
     }catch(err){
          console.log("Error")
     }
}




export const deleteUser = async (req: Request, res: Response, next: NextFunction)=>{
     try{
         const { _id } = req.params
 
 
         //Finding the code using the bookid ror the title name we equate it to book 
         const user = await User.findOneAndDelete({_id})
 
         if(!user){
           return res.status(400).json({
                message: `USer with id: ${_id} not found`
           })
         }
         const users = await User.find({})
               return res.status(200).json({
                    message: `User deleted successfully`,
                    users
               });
           
         
 
     }catch(err){
         return res.status(500).json({
             Error: " Internal server Error"
         });
     };
 
 };





// import { db } from "../config"


// export const createUser = (req: Request, res: Response ) =>{
//      //we imported this from config to call all our methods to query the datbase
//      try {
//           const { firstName, lastName, email} = req.body;
//           const findUser = await User.findOne({email})
//           if(findUser){
//                return res.status(400).json({
//                     message: `User already exists`
//                })
//           }

//           const salt = await SaltGenerator();

//           const password = await passwordGenerator(lastName);
          
//           const hashedPassword = await hashPassword(password, salt)

//           if(!findUser){
//                let newUser = await User.create({
//                     firstName,
//                     lastName,
//                     email,
//                     password: hashedPassword,
//                     role: "Author",
//                     books: []
               
//                })

//                const mainUser = await User.findOne({email})
//                console.log(mainUser)

//                if(mainUser){
//                     const html = emailHtml(email, password)
//                     await sendmail(`${process.env.GMAIL_USER}`, email, 'welcome', html)
//                     return res.status(200).json({
//                          message: `User created successfully`,
//                          role: mainUser.role
//                     })

//                }
//                return res.status(401).json({
//                     message: `Unable to create user`
//                })
//           }

//      } catch (error) {
//           return res.status(500).json({
//                mesage: 'Internal server error',
//                Error: '/users/create'
//           })
//      }
// }
// };

