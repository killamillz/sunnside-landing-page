"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolvers = void 0;
const userModels_1 = __importDefault(require("../models/userModels"));
const bookModels_1 = __importDefault(require("../models/bookModels"));
const validation_1 = require("../validation/validation");
const utility_1 = require("../utilities/utility");
const notification_1 = require("../utilities/notification");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const graphql_1 = require("graphql");
exports.resolvers = {
    Query: {
        getUsers: async () => {
            try {
                const users = userModels_1.default.find({});
                return users;
            }
            catch (error) {
                console.log(error);
            }
        },
        getUser: async (_, _id) => {
            try {
                const users = await userModels_1.default.findOne({ _id: _id });
                return users;
            }
            catch (error) {
                console.log(error);
            }
        },
        getBooks: async () => {
            try {
                const books = await bookModels_1.default.find({});
                return books;
            }
            catch (error) {
                console.log(error);
            }
        },
        getBook: async (_, _id) => {
            try {
                const book = await bookModels_1.default.findOne({ _id: _id });
                return book;
            }
            catch (error) {
                console.log(error);
            }
        }
    },
    Mutation: {
        createUser: async (_, args) => {
            try {
                const { email, firstName, lastName } = args.user;
                const user = await userModels_1.default.findOne({ email });
                const salt = await (0, utility_1.SaltGenerator)();
                const password = await (0, utility_1.passwordGenerator)(lastName);
                const hashedPassword = await (0, utility_1.hashPassword)(password, salt);
                if (!user) {
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
                        return mainUser;
                    }
                    return newUser;
                }
            }
            catch (error) {
                console.log(error);
            }
        },
        loginUser: async (_, args) => {
            try {
                const users = args.user;
                const error = validation_1.userSchema2.safeParse(users);
                if (error.success === true) {
                    const { email, _id, password } = args.user;
                    const user = await userModels_1.default.findOne({ email });
                    if (user) {
                        const validate = await bcryptjs_1.default.compare(password, user.password);
                        if (validate) {
                            const token = await (0, utility_1.tokenGenerator)(`${_id}`);
                            console.log("user", user, "token", token);
                            return {
                                user,
                                token
                            };
                        }
                    }
                }
            }
            catch (error) {
                console.log(error);
            }
        },
        updateUser: async (_, args) => {
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
                const { _id, firstName, lastName, email, password, gender } = args.user;
                const salt = await (0, utility_1.SaltGenerator)();
                const passwords = await (0, utility_1.passwordGenerator)(password);
                const hashedPassword = await (0, utility_1.hashPassword)(passwords, salt);
                const ifUser = await userModels_1.default.findOneAndUpdate({ _id }, { firstName, lastName, email, password: utility_1.hashPassword, gender });
                console.log(ifUser);
                if (!ifUser) {
                    // This runs when there is no book found using the Id to search
                    throw new graphql_1.GraphQLError('User not found', {
                        extensions: {
                            code: 'UNAUTHENTICATED',
                            http: { status: 401 },
                        },
                    });
                }
                ;
                //if book is found then we would find and update using the mongodb query 
                return ifUser;
            }
            catch (error) {
                console.log(error);
            }
        }
    }
};
