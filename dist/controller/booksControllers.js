"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteBook = exports.getSingleBook = exports.getBooks = exports.updateBook = exports.createBook = void 0;
const validation_1 = require("../validation/validation");
const bookModels_1 = __importDefault(require("../models/bookModels"));
//Method to creating a book 
const createBook = async (req, res, next) => {
    try {
        // This are the details gotten from the frontEnd 
        const books = req.body;
        // This is to validate that all requored fields are inputed
        const error = validation_1.userSchemaBooks.safeParse(books);
        if (error.success === false) {
            return res.status(400).send({
                status: "Error",
                message: error.error.issues[0].message
            });
        }
        ;
        //Here we are trying to make sure that there are not rbooks with same title
        const { title, author, datePublished, description, pageCount, genre, Publisher } = req.body;
        const existingBook = await bookModels_1.default.findOne({ title });
        // We are sending this error message because the book exists
        if (existingBook) {
            return res.status(400).send({
                status: "ERROR",
                message: "This book already exists"
            });
        }
        ;
        //If the book doesn't exist we create the new book we the details gott from the frontEnd
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
        //This is the item to be displayed on the frontEnd 
        return res.status(200).json({
            message: `Book posted successfully`,
            newBook
        });
    }
    catch (err) {
        console.log(err);
    }
};
exports.createBook = createBook;
// Method for updating a book
// AIM: we want to search for a book and update it in out file system, we would also render in our frontEnd 
const updateBook = async (req, res, next) => {
    // This try/catch block is use to ibe able to catch all error withnessed within the code 
    try {
        const books = req.body;
        const error = validation_1.userSchemaBooks.safeParse(books);
        if (error.success === false) {
            return res.status(400).send({
                status: "Error",
                message: error.error.issues[0].message
            });
        }
        ;
        const { title, author, datePublished, description, pageCount, genre, Publisher } = req.body;
        const { _id } = req.params;
        const ifBook = await bookModels_1.default.findOneAndUpdate({ _id }, { author, datePublished, description, pageCount, genre, Publisher });
        if (!ifBook) {
            // This runs when there is no book found using the Id to search
            return res.status(404).json({
                message: "book not found"
            });
        }
        ;
        //if book is found then we would find and update using the mongodb query 
        return res.status(200).json({
            message: `Book updated successfully`,
            books
        });
    }
    catch (err) {
        return res.status(500).json({
            Error: "Internal server Error"
        });
    }
    ;
};
exports.updateBook = updateBook;
// Method for getting all books
// We want to get all books in our file system. Therefore we read from our file system and render it back to hte frontEnd
const getBooks = async (req, res, next) => {
    try {
        const page = req.query.page || 1;
        const bookPage = 5;
        const allBooks = await bookModels_1.default.find({}).skip((page - 1) * bookPage).limit(bookPage);
        if (allBooks) {
            return res.status(200).json({
                message: "Here are the list of books available",
                allBooks
            });
        }
        return res.status(404).json({
            message: `No books were found`,
            status: `Error`
        });
    }
    catch (err) {
        return res.status(404).json({
            Error: "No books available"
        });
    }
    ;
};
exports.getBooks = getBooks;
//Method for getting a single books 
//We want to get a particular book in our file system using the id to search for it 
const getSingleBook = async (req, res, next) => {
    try {
        const { _id } = req.params;
        const book = await bookModels_1.default.findOne({ _id });
        // If not found display this error
        if (!book) {
            return res.status(400).json({
                message: "book not found"
            });
        }
        ;
        return res.status(200).json({
            //show the particular book that fulfils the conditions gotten from the frontEnd 
            message: "The book searched for is available",
            book
        });
    }
    catch (err) {
        return res.status(404).json({
            Error: "Book not found"
        });
    }
};
exports.getSingleBook = getSingleBook;
// //Method for deleting books 
// // We want to remove a particular book from our file system using the id to search and do this 
const deleteBook = async (req, res, next) => {
    try {
        const { _id } = req.params;
        //Finding the code using the bookid ror the title name we equate it to book 
        const book = await bookModels_1.default.findOneAndDelete({ _id });
        if (!book) {
            return res.status(400).json({
                message: `book with id: ${_id} not found`
            });
        }
        const books = await bookModels_1.default.find({});
        return res.status(200).json({
            message: `Book deleted successfully`,
            books
        });
    }
    catch (err) {
        return res.status(404).json({
            Error: "Book not found"
        });
    }
    ;
};
exports.deleteBook = deleteBook;
