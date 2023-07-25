"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userSchemaBooks = exports.userSchema2 = exports.userSchema = void 0;
const zod_1 = __importDefault(require("zod"));
exports.userSchema = zod_1.default.object({
    userName: zod_1.default.string({
        required_error: "Username is required!"
    }),
    firstName: zod_1.default.string({
        required_error: "firstName is required!"
    }),
    gender: zod_1.default.string({
        required_error: "Gender is required!"
    }),
    email: zod_1.default.string({
        required_error: "Email is required!"
    }).email(),
    password: zod_1.default.string({
        required_error: "Password is required!"
    }).min(5)
});
exports.userSchema2 = zod_1.default.object({
    email: zod_1.default.string({
        required_error: "Email is required!"
    }).email(),
    password: zod_1.default.string({
        required_error: "Password is required!"
    }).min(5)
});
exports.userSchemaBooks = zod_1.default.object({
    title: zod_1.default.string({
        required_error: "Title is required!"
    }),
    author: zod_1.default.string({
        required_error: "Author name is required!"
    }),
    datePublished: zod_1.default.string({
        required_error: "Date published is required!"
    }),
    description: zod_1.default.string({
        required_error: "Description is required!"
    }),
    pageCount: zod_1.default.number({
        required_error: "The page count is required!"
    }),
    genre: zod_1.default.string({
        required_error: "Genre is required!"
    }),
    Publisher: zod_1.default.string({
        required_error: "Publisher name is required!"
    }),
});
