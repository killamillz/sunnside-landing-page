"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.auth = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const auth = (req, res, next) => {
    try {
        const authorisation = req.headers.authorization;
        if (authorisation === undefined) {
            return res.status(401).send({
                status: 'ERROR',
                message: "You are not authorized"
            });
        }
        const pin = authorisation.split(" ")[1];
        if (!pin || pin === "") {
            return res.status(401).send({
                status: 'ERROR',
                message: "Pin is required."
            });
        }
        const decoded = jsonwebtoken_1.default.verify(pin, "bright");
        if ("user" in req) {
            req.user = decoded;
        }
        return next();
    }
    catch (err) {
        console.log();
    }
};
exports.auth = auth;
