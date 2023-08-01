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
        getUsers: async (_, args, context) => {
            try {
                if (!context.decoded) {
                    throw new graphql_1.GraphQLError('User is not authenticated', {
                        extensions: {
                            code: 'UNAUTHENTICATED',
                            http: { status: 401 },
                        },
                    });
                }
                const users = userModels_1.default.find({});
                return users;
            }
            catch (error) {
                console.log(error);
            }
        },
        getUser: async (_, _id, context) => {
            try {
                if (!context.decoded) {
                    throw new graphql_1.GraphQLError('User is not authenticated', {
                        extensions: {
                            code: 'UNAUTHENTICATED',
                            http: { status: 401 },
                        },
                    });
                }
                const users = await userModels_1.default.findOne({ _id: _id });
                return users;
            }
            catch (error) {
                console.log(error);
            }
        },
        getBooks: async (_, args, context) => {
            try {
                if (!context.decoded) {
                    throw new graphql_1.GraphQLError('User is not authenticated', {
                        extensions: {
                            code: 'UNAUTHENTICATED',
                            http: { status: 401 },
                        },
                    });
                }
                const books = await bookModels_1.default.find({});
                return books;
            }
            catch (error) {
                console.log(error);
            }
        },
        getBook: async (_, _id, context) => {
            try {
                if (!context.decoded) {
                    throw new graphql_1.GraphQLError('User is not authenticated', {
                        extensions: {
                            code: 'UNAUTHENTICATED',
                            http: { status: 401 },
                        },
                    });
                }
                const book = await bookModels_1.default.findOne({ _id: _id });
                return book;
            }
            catch (error) {
                console.log(error);
            }
        }
    },
    Mutation: {
        createUser: async (_, args, context) => {
            try {
                if (!context.id) {
                    const { email, firstName, lastName } = args.user;
                    const user = await userModels_1.default.findOne({ email });
                    const salt = await (0, utility_1.SaltGenerator)();
                    const password = await (0, utility_1.passwordGenerator)(lastName);
                    const hashedPassword = await (0, utility_1.hashPassword)(password, salt);
                    if (user) {
                        throw new graphql_1.GraphQLError('User already exists', {
                            extensions: {
                                code: 'UNAUTHENTICATED',
                                http: { status: 401 },
                            },
                        });
                    }
                    let newUser = await userModels_1.default.create({
                        firstName,
                        lastName,
                        email,
                        password: hashedPassword,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    });
                    const mainUser = await userModels_1.default.findOne({ email });
                    if (!mainUser) {
                        throw new graphql_1.GraphQLError('User was not created', {
                            extensions: {
                                code: 'UNAUTHENTICATED',
                                http: { status: 401 },
                            },
                        });
                    }
                    const html = (0, notification_1.emailHtml)(email, password);
                    await (0, notification_1.sendmail)(`${process.env.GMAIL_USER}`, email, 'welcome', html);
                    return newUser;
                }
            }
            catch (error) {
                console.log(error);
            }
        },
        loginUser: async (_, args) => {
            try {
                // if(context.decoded){
                //        throw new GraphQLError('User is not authenticated', {
                //               extensions: {
                //               code: 'UNAUTHENTICATED',
                //               http: { status: 401 },
                //               },
                //        });
                // }
                const users = args.user;
                const error = validation_1.userSchema2.safeParse(users);
                if (error.success === false) {
                    throw new graphql_1.GraphQLError('User input not completely filled', {
                        extensions: {
                            code: 'UNAUTHENTICATED',
                            http: { status: 401 },
                        },
                    });
                }
                const { email, _id, password } = args.user;
                const user = await userModels_1.default.findOne({ email });
                if (!user) {
                    throw new graphql_1.GraphQLError(`Invalid email address`, {
                        extensions: {
                            code: 'UNAUTHENTICATED',
                            http: { status: 401 },
                        },
                    });
                }
                const validate = await bcryptjs_1.default.compare(password, user.password);
                if (!validate) {
                    throw new graphql_1.GraphQLError('Incorrect password', {
                        extensions: {
                            code: 'UNAUTHENTICATED',
                            http: { status: 401 },
                        },
                    });
                }
                const token = await (0, utility_1.tokenGenerator)(_id);
                return { token };
            }
            catch (error) {
                console.log(error);
            }
        },
        updateUser: async (_, args, context) => {
            try {
                if (!context.decoded) {
                    throw new graphql_1.GraphQLError('User is not authenticated', {
                        extensions: {
                            code: 'UNAUTHENTICATED',
                            http: { status: 401 },
                        },
                    });
                }
                const user = args.user;
                const error = validation_1.userSchema1.safeParse(user);
                console.log(error);
                if (error.success === false) {
                    throw new graphql_1.GraphQLError('User is not authenticated', {
                        extensions: {
                            code: 'UNAUTHENTICATED',
                            http: { status: 401 },
                        },
                    });
                }
                ;
                const { _id, firstName, lastName, email, password, gender } = args.user;
                const salt = await (0, utility_1.SaltGenerator)();
                const passwords = await (0, utility_1.passwordGenerator)(password);
                const hashedPassword = await (0, utility_1.hashPassword)(passwords, salt);
                const ifUser = await userModels_1.default.findOneAndUpdate({ _id }, { firstName, lastName, email, password: hashedPassword, gender });
                console.log(ifUser);
                if (!ifUser) {
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
        },
        deleteUser: async (_, args, context) => {
            try {
                if (!context.decoded) {
                    throw new graphql_1.GraphQLError('User is not authenticated', {
                        extensions: {
                            code: 'UNAUTHENTICATED',
                            http: { status: 401 },
                        },
                    });
                }
                const _id = args.id;
                const user = await userModels_1.default.findByIdAndDelete(_id);
                if (!user) {
                    throw new graphql_1.GraphQLError('User does not exist', {
                        extensions: {
                            code: 'UNAUTHENTICATED',
                            http: { status: 404 },
                        },
                    });
                }
                return user;
            }
            catch (error) {
                console.log(error);
            }
        },
        createBook: async (_, args, context) => {
            try {
                if (!context.decoded) {
                    throw new graphql_1.GraphQLError('User is not authenticated', {
                        extensions: {
                            code: 'UNAUTHENTICATED',
                            http: { status: 401 },
                        },
                    });
                }
                const book = args.book;
                const error = validation_1.userSchemaBooks.safeParse(book);
                if (error.success === false) {
                    throw new graphql_1.GraphQLError('Input undefined', {
                        extensions: {
                            code: 'ERROR',
                            http: { status: 404 },
                        },
                    });
                }
                const { title, author, datePublished, description, pageCount, genre, Publisher } = args.book;
                const existingBook = await bookModels_1.default.findOne({ title });
                if (existingBook) {
                    throw new graphql_1.GraphQLError('Book title exists already', {
                        extensions: {
                            code: 'ERROR',
                            http: { status: 404 },
                        },
                    });
                }
                let newBook = await bookModels_1.default.create({
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
                return newBook;
            }
            catch (error) {
                console.log(error);
            }
        },
        updateBook: async (_, args, context) => {
            try {
                if (!context.decoded) {
                    throw new graphql_1.GraphQLError('User is not authenticated', {
                        extensions: {
                            code: 'UNAUTHENTICATED',
                            http: { status: 401 },
                        },
                    });
                }
                const books = args.book;
                const error = validation_1.userSchemaBooks.safeParse(books);
                if (error.success === false) {
                    throw new graphql_1.GraphQLError('missing input check requirement', {
                        extensions: {
                            code: 'ERROR',
                            http: { status: 404 },
                        },
                    });
                }
                ;
                const { id, title, author, datePublished, description, pageCount, genre, Publisher } = args.book;
                const ifBook = await bookModels_1.default.findByIdAndUpdate(id, { title, author, datePublished, description, pageCount, genre, Publisher });
                if (!ifBook) {
                    throw new graphql_1.GraphQLError('Book not found', {
                        extensions: {
                            code: 'ERROR',
                            http: { status: 404 },
                        },
                    });
                }
                ;
                return ifBook;
            }
            catch (error) {
                console.log(error);
            }
        },
        deleteBook: async (_, args, context) => {
            try {
                if (!context.decoded) {
                    throw new graphql_1.GraphQLError('User is not authenticated', {
                        extensions: {
                            code: 'UNAUTHENTICATED',
                            http: { status: 401 },
                        },
                    });
                }
                const _id = args.id;
                const book = await bookModels_1.default.findByIdAndDelete(_id);
                if (!book) {
                    throw new graphql_1.GraphQLError('Book not found', {
                        extensions: {
                            code: 'ERROR',
                            http: { status: 404 },
                        },
                    });
                }
                return book;
            }
            catch (error) {
                console.log(error);
            }
        }
    }
};
