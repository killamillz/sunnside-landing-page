"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.getSingleUser = exports.getAllUsers = exports.login = exports.createUser = void 0;
const userModels_1 = __importDefault(require("../models/userModels"));
const utility_1 = require("../utilities/utility");
const notification_1 = require("../utilities/notification");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const validation_1 = require("../validation/validation");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const createUser = async (req, res) => {
    // import from the frontend
    // use the mongoose to find the email
    try {
        const { firstName, lastName, email } = req.body;
        const findUser = await userModels_1.default.findOne({ email });
        if (findUser) {
            return res.status(404).json({
                message: `User already exists`,
                status: `Error`
            });
        }
        const salt = await (0, utility_1.SaltGenerator)();
        const password = await (0, utility_1.passwordGenerator)(lastName);
        const hashedPassword = await (0, utility_1.hashPassword)(password, salt);
        if (!findUser) {
            let newUser = await userModels_1.default.create({
                firstName,
                lastName,
                email,
                password: hashedPassword
            });
            const mainUser = await userModels_1.default.findOne({ email });
            if (mainUser) {
                const html = (0, notification_1.emailHtml)(email, password);
                await (0, notification_1.sendmail)(`${process.env.GMAIL_USER}`, email, 'welcome', html);
                return res.status(200).json({
                    message: `User created successfully`
                });
            }
            return res.status(401).json({
                message: `Unable to create user`
            });
        }
    }
    catch (err) {
        return res.status(500).json({
            message: `Internal server error`,
            status: "Error"
        });
    }
};
exports.createUser = createUser;
const login = async (req, res, next) => {
    try {
        const users = req.body;
        const error = validation_1.userSchema2.safeParse(users);
        if (error.success === false) {
            return res.status(400).send({
                status: "Error",
                message: error.error.issues[0].message
            });
        }
        const { email } = req.body;
        const user = await userModels_1.default.findOne({ email });
        if (!user) {
            return res.status(404).json({
                message: `User with ${users.email} not found`
            });
        }
        if (user) {
            const validate = await bcryptjs_1.default.compare(users.password, user.password);
            if (!validate) {
                return res.status(400).json({
                    message: `invalid password`
                });
            }
            if (validate) {
                const token = await (0, utility_1.tokenGenerator)(`${user._id}`);
                res.cookie('token', token);
                return res.status(200).json({
                    message: "login successful",
                    email: user.email,
                });
            }
        }
    }
    catch (error) {
        return res.status(500).json({
            message: `Internal server error`
        });
    }
};
exports.login = login;
const getAllUsers = async (req, res) => {
    try {
        const allUSers = await userModels_1.default.find({});
        if (!allUSers) {
            return res.status(404).json({
                message: `Error getting all users`
            });
        }
        if (allUSers) {
            return res.status(200).json({
                message: `Users gotten successfully`,
                allUSers
            });
        }
    }
    catch (error) {
        return res.status(500).json({
            message: `Internal service error`
        });
    }
};
exports.getAllUsers = getAllUsers;
const getSingleUser = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await userModels_1.default.findOne({ email }, { password: 0 });
        if (!user) {
            return res.status(404).json({
                message: `User not found`,
                status: `failed`
            });
        }
        if (user) {
            return res.status(200).json({
                message: `User fetched successfully`,
                user
            });
        }
    }
    catch (err) {
        console.log("Error");
    }
};
exports.getSingleUser = getSingleUser;
const deleteUser = async (req, res, next) => {
    try {
        const { _id } = req.params;
        //Finding the code using the bookid ror the title name we equate it to book 
        const user = await userModels_1.default.findOneAndDelete({ _id });
        if (!user) {
            return res.status(400).json({
                message: `USer with id: ${_id} not found`
            });
        }
        const users = await userModels_1.default.find({});
        return res.status(200).json({
            message: `User deleted successfully`,
            users
        });
    }
    catch (err) {
        return res.status(500).json({
            Error: " Internal server Error"
        });
    }
    ;
};
exports.deleteUser = deleteUser;
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
