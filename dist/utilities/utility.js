"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.tokenGenerator = exports.hashPassword = exports.passwordGenerator = exports.SaltGenerator = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const SaltGenerator = async () => {
    return bcrypt_1.default.genSalt(10);
};
exports.SaltGenerator = SaltGenerator;
const passwordGenerator = async (lastName) => {
    const mixup = lastName += Math.floor(1000 + Math.random() * 9000);
    return mixup;
};
exports.passwordGenerator = passwordGenerator;
const hashPassword = async (password, salt) => {
    return bcrypt_1.default.hash(password, salt);
};
exports.hashPassword = hashPassword;
const tokenGenerator = async (_id) => {
    return jsonwebtoken_1.default.sign({ _id }, `${process.env.APP_SECRET}`, { expiresIn: `1d` });
};
exports.tokenGenerator = tokenGenerator;
