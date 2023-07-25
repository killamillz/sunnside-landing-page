"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDatabase = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const connectDatabase = async () => {
    try {
        const connect = mongoose_1.default.connect(`mongodb+srv://killamillz0:Berbatov94_@cluster0.78xg8at.mongodb.net/`, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        return console.log(`MongoDb connected Successfully`);
    }
    catch (error) {
        console.log("ERROR", error);
    }
};
exports.connectDatabase = connectDatabase;
