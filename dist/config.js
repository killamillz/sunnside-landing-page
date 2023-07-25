"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = exports.main = exports.client = void 0;
const mongoDb_1 = require("mongoDb");
//Here we are connecting the mongoDb database to the express application for books
//firstly we define the client, url, and database name
const url = "mongodb://localhost:27017";
//This is the default url for mongoDb
exports.client = new mongoDb_1.MongoClient(url);
//setting the connection to client variable
const dbName = "booksDatabase";
//I will have an async function called main that will handel the connection.
//check mongodb setup connection.
async function main() {
    await exports.client.connect();
    console.log('connected successfully to serve');
    const db = exports.client.db(dbName);
    const collection = db.collection("documents");
    return 'done';
}
exports.main = main;
const db = () => {
    return exports.client.db(dbName);
};
exports.db = db;
