"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteBook = exports.getSingleBook = exports.getBooks = exports.upadateBook = exports.createBook = void 0;
const uuid_1 = require("uuid");
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const validation_1 = require("../validation/validation");
let bookDatabaseFolder = path_1.default.join(__dirname, "../../src/bookDatabase");
let bookDatabaseFile = path_1.default.join(bookDatabaseFolder, "bookDatabase.json");
//Method to creating a book 
const createBook = async (req, res, next) => {
    try {
        //creating my database dynamically
        if (!fs_1.default.existsSync(bookDatabaseFolder)) {
            fs_1.default.mkdirSync(bookDatabaseFolder);
        }
        if (!fs_1.default.existsSync(bookDatabaseFile)) {
            fs_1.default.writeFileSync(bookDatabaseFile, ' ');
        }
        //read from database
        let allBooks = [];
        try {
            const infos = fs_1.default.readFileSync(bookDatabaseFile, "utf8");
            if (!infos) {
                return res.status(400).json({
                    message: `file not readable`
                });
            }
            else {
                //JSON.parse is usedd to change the file rread into a useable flle in our program
                allBooks = JSON.parse(infos);
            }
            ;
        }
        catch (parseError) {
            allBooks = [];
        }
        ;
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
        const existingBook = allBooks.find((book) => book.title === books.title);
        // We are sending this error message because the book exists
        if (existingBook) {
            return res.status(400).send({
                status: "ERROR",
                message: "This book already exists"
            });
        }
        ;
        //If the book doesn't exist we create the new book we the details gott from the frontEnd
        let newBook = {
            title: books.title,
            author: books.author,
            datePublished: books.datePublished,
            description: books.description,
            pageCount: books.pageCount,
            genre: books.genre,
            bookId: (0, uuid_1.v4)(),
            Publisher: books.Publisher,
            createdAt: new Date(),
            updatedAt: new Date()
        };
        // We are inout the book back into the allbooks array 
        allBooks.push(newBook);
        // Now we can write the whole book array into a file 
        fs_1.default.writeFile(bookDatabaseFile, JSON.stringify(allBooks, null, 2), 'utf8', (err) => {
            if (err) {
                return res.status(500).json({
                    message: `Book can't be uploaded`
                });
            }
            else {
                //This is the item to be displayed on the frontEnd 
                return res.status(200).json({
                    message: `Book posted successfully`,
                    newBook
                });
            }
            ;
        });
    }
    catch (err) {
        console.log(err);
    }
};
exports.createBook = createBook;
// Method for updating a book
// AIM: we want to search for a book and update it in out file system, we would also render in our frontEnd 
const upadateBook = async (req, res, next) => {
    // This try/catch block is use to ibe able to catch all error withnessed within the code 
    try {
        const infos = JSON.parse(fs_1.default.readFileSync(bookDatabaseFile, "utf8"));
        const books = req.body;
        const error = validation_1.userSchemaBooks.safeParse(books);
        if (error.success === false) {
            return res.status(400).send({
                status: "Error",
                message: error.error.issues[0].message
            });
        }
        ;
        // Here we want to check for the particular book we want to update using the id as instructed 
        const book = infos.find((item) => item.bookId === req.params.id);
        if (!book) {
            // This runs when there is no book found using the Id to search
            return res.status(404).json({
                message: "book not found"
            });
        }
        ;
        //If found then we replace the object values with thevalue coming from the frontEnd 
        book.title = books.title;
        book.author = books.author;
        book.datePublished = books.datePublished;
        book.description = books.description;
        book.pageCount = books.pageCount;
        book.genre = books.genre;
        book.bookId = books.bookId;
        book.Publisher = books.Publisher;
        //Then we write it back into the file 
        fs_1.default.writeFile(bookDatabaseFile, JSON.stringify(infos, null, 2), 'utf8', (err) => {
            if (err) {
                return res.status(400).json({
                    message: `Book can't be uploaded`
                });
            }
            else {
                return res.status(200).json({
                    message: `Book updated successfully`,
                    books
                });
            }
            ;
        });
    }
    catch (err) {
        return res.status(500).json({
            Error: "Internal sevrver Error"
        });
    }
    ;
};
exports.upadateBook = upadateBook;
// Method for getting all books
// We want to get all books in our file system. Therefore we read from our file system and render it back to hte frontEnd
const getBooks = async (req, res, next) => {
    try {
        const infos = JSON.parse(fs_1.default.readFileSync(bookDatabaseFile, 'utf8'));
        return res.status(200).json({
            message: "Here are the list of books available",
            infos
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
        const infos = JSON.parse(fs_1.default.readFileSync(bookDatabaseFile, 'utf8'));
        // Here we want to check for the particular book we want to update using the id as instructed 
        let book = infos.filter((user) => {
            return user.bookId === req.params.id;
        });
        // If not found display this error
        if (!book) {
            return res.status(400).json({
                message: "book not found"
            });
        }
        ;
        if (book = []) {
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
//Method for deleting books 
// We want to remove a particular book from our file system using the id to search and do this 
const deleteBook = async (req, res, next) => {
    try {
        let allBooks = [];
        // Why do we have a try/catch in a try/catch = we want to be jable to catch any error happening in this block so our code won't break
        try {
            const infos = fs_1.default.readFileSync(bookDatabaseFile, "utf8");
            if (!infos) {
                return res.status(400).json({
                    message: `file not readable`
                });
            }
            else {
                allBooks = JSON.parse(infos);
            }
        }
        catch (parseError) {
            allBooks = [];
        }
        const id = req.params.id;
        //Finding the code using the bookid ror the title name we equate it to book 
        const book = allBooks.find((item) => item.bookId === id);
        if (!book) {
            return res.status(400).json({
                message: `book with id: ${id} not found`
            });
        }
        const index = allBooks.indexOf(book);
        //Now we want to delete book from the array of allbooks 
        allBooks.splice(index, 1);
        //Then we write it back into the file 
        fs_1.default.writeFile(bookDatabaseFile, JSON.stringify(allBooks, null, 2), 'utf8', (err) => {
            if (err) {
                return res.status(400).json({
                    message: `Book can't be uploaded`
                });
            }
            else {
                return res.status(200).json({
                    message: `Book deleted successfully`,
                    allBooks
                });
            }
            ;
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
