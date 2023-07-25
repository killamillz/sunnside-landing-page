"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const mongoose_2 = require("mongoose");
const userSchema = new mongoose_2.Schema({
    firstName: {
        type: String,
        require: [true, `Please input your firstname`]
    },
    lastName: {
        type: String,
        require: [true, `please input your lastName`]
    },
    email: {
        type: String,
        require: [true, `please input email`]
    },
    password: {
        type: String,
        require: [false]
    }
});
const User = mongoose_1.default.model('User', userSchema);
exports.default = User;
