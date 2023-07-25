"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const mongoose_1 = __importDefault(require("mongoose"));
const app_1 = require("../app");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
/* Connecting to the database before each test. */
beforeEach(async () => {
    await mongoose_1.default.connect(`${process.env.MONGODB_URI}`);
});
/* Closing database connection after each test. */
afterEach(async () => {
    await mongoose_1.default.connection.close();
});
const signupInfo = {
    "email": "ogobright@gmail.com",
    "lastName": "Bright",
    "firstName": "Tinubu"
};
const logInfo = {
    "email": "killamillz0@gmail.com",
    "password": "Bright1746"
};
const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NGI1MzY4OTNjYTg0MDVkMzQ5NTU5ODEiLCJpYXQiOjE2ODk2MjIxODUsImV4cCI6MTY4OTcwODU4NX0.SrBv6krRys8zttpCdgOIqSun0IAHoTMLDBdKUIo6P8g";
describe("user flow", () => {
    it('/POST user signup', async () => {
        const user = await (0, supertest_1.default)(app_1.app).post('/users/signup')
            .send(signupInfo);
        //test for success
        if (user.statusCode === 200) {
            expect(user.body.message).toBe(`User created successfully`);
        }
        else if (user.statusCode === 404) {
            expect(user.body.message).toBe(`User already exists`);
        }
    });
    it('/POST user login', async () => {
        const user = await (0, supertest_1.default)(app_1.app).post('/users/login')
            .send(logInfo);
        if (user.statusCode === 200) {
            expect(user.body.message).toBe('login successful');
        }
        else if (user.statusCode === 404) {
            expect(user.body.message).toBe(`User with ${logInfo.email} not found`);
        }
        else {
            expect(user.body.message).toBe(`invalid password`);
        }
    });
    it('/GET get Users', async () => {
        const user = await (0, supertest_1.default)(app_1.app).get('/users/getUsers')
            .set('authorization', `Bearer ${token}`);
        expect(user.statusCode).toBe(200);
        expect(Array.isArray(user.body)).toBe(false);
    });
    it('/GET get single User', async () => {
        const user = await (0, supertest_1.default)(app_1.app).get('/users/getUser')
            .set('authorization', `Bearer ${token}`).send("nosaobasuyiofficial@gmail.com");
        if (user.statusCode === 200) {
            expect(user.body.message).toBe(`User fetched successfully`);
            expect(Array.isArray(user.body)).toBe(false);
        }
        else {
            expect(user.body.message).toBe(`User not found`);
        }
    });
    test('/DELETE delete user', async () => {
        const response = await (0, supertest_1.default)(app_1.app).delete(`/users/deleteUser/64b3febb9d5f718e8e190235`)
            .set('authorization', `Bearer ${token}`);
        if (response.statusCode === 200) {
            expect(response.body.message).toBe(`User deleted successfully`);
        }
        else {
            expect(response.body.message).toBe(`USer with id: 64b3febb9d5f718e8e190235 not found`);
        }
    });
    it('/POST create books', async () => {
        const books = {
            "title": "The new king",
            "author": "Guy Raz",
            "datePublished": "1950",
            "description": "lessons for StartUps",
            "pageCount": 800,
            "genre": "Business",
            "bookId": "61d22210-daa3-4c7b-837c-bbe7d0cd4fde",
            "Publisher": "eddyVines",
            "createdAt": "2023-06-28T12:29:06.139Z",
            "updatedAt": "2023-06-28T12:29:06.139Z"
        };
        const bookResponse = await (0, supertest_1.default)(app_1.app).post('/books/create').send(books)
            .set('authorization', `Bearer ${token}`);
        if (bookResponse.statusCode === 200) {
            expect(bookResponse.body.message).toBe("Book posted successfully");
        }
        else {
            expect(bookResponse.body.message).toBe("This book already exists");
        }
    });
    it('/GET get Books', async () => {
        const books = await (0, supertest_1.default)(app_1.app).get('/books/display')
            .set('authorization', `Bearer ${token}`);
        expect(books.statusCode).toBe(200);
        expect(Array.isArray(books.body)).toBe(false);
        expect(typeof (Number(books.body.pageCount))).toBeTruthy();
    });
    it('/GET get single book', async () => {
        const user = await (0, supertest_1.default)(app_1.app).get('/books/oneBook/64b5a49c3d8356d2cc9434ac')
            .set('authorization', `Bearer ${token}`).send("Amongst the hound");
        if (user.statusCode === 200) {
            expect(user.body.message).toBe(`The book searched for is available`);
            expect(Array.isArray(user.body)).toBe(false);
        }
        else {
            expect(user.body.message).toBe(`book not found`);
        }
    });
    test('/PUT Update books', async () => {
        const books = {
            "title": "I 'm the bester",
            "author": "Guy Rayy",
            "datePublished": "1980",
            "description": "lessons for StartUps",
            "pageCount": 800,
            "genre": "Business",
            "Publisher": "eddyVines"
        };
        const bookResponse = await (0, supertest_1.default)(app_1.app).put('/books/update/64b5a49c3d8356d2cc9434ac').send(books)
            .set('authorization', `Bearer ${token}`);
        if (bookResponse.statusCode === 200) {
            expect(bookResponse.body.message).toBe("Book updated successfully");
        }
        else if (bookResponse.statusCode === 400) {
            expect(bookResponse.body.message).toBe("Book can't be uploaded");
        }
        else {
            expect(bookResponse.body.message).toBe("book not found");
        }
    });
    test('/DELETE delete books', async () => {
        const response = await (0, supertest_1.default)(app_1.app).delete(`/books/delete/64b630629217addd735ca452`)
            .set('authorization', `Bearer ${token}`);
        if (response.statusCode === 200) {
            expect(response.body.message).toBe(`Book deleted successfully`);
        }
        else if (response.statusCode === 400) {
            expect(response.body.message).toBe(`book with id: 64b630629217addd735ca452 not found`);
        }
    });
});
//  let token = "";
// const logUser = {
//      email: "ogok@gmail.com",
//      password: "123455"
// };
// const newBook = {
//      title: "I 'm the bestsss",
//      author: "Guy Raz",
//      datePublished: "1950",
//      description: "lessons for StartUps",
//      pageCount: 800,
//      genre: "Business",
//      Publisher: "eddyVines"
// };
// const secondBook = 
// {
//   title: "manr",
//   author: "hjohn",
//   datePublished: "dec xgbd20 2023",
//   description: " advendafgvedszture",
//   pageCount: 80,
//   genre: "Treatise, Non-fiction",
//   bookId: "98a527b7-78f2-4e86-b175-d94f455ff75d",
//   Publisher: " Project Gutenberg ",
//   createdAt: "2023-06-27T08:12:02.818Z",
//   updatedAt: "2023-06-27T08:12:02.818Z"
// };
// const id2 = `12345`;
// describe("when details for a book are presented", () => {
//      it("should create a new book", async () => {
//           const resLogin = await supertest(app).post(`/users/login`).send(logUser);
//           token = resLogin.body.token;
//           const res = await supertest(app)
//                .post(`/books/create`)
//                .send(newBook)
//                .set("authorization", `Bearer ${token}`);
//           expect(res.status).toBe(200);
//           expect(res.body).toHaveProperty("message");
//           expect(res.body).toHaveProperty("newBook");
//           expect(res.body.newBook).toHaveProperty("bookId");
//           expect(res.body.message).toEqual("Book posted successfully");
//     });
//      it("should not create a new book", async () => {
//           const resLogin = await supertest(app).post(`/users/login`).send(logUser);
//           token = resLogin.body.token;
//           const res = await supertest(app)
//             .post(`/books/create`)
//             .send(newBook)
//             .set("authorization", `Bearer ${token}`);
//           expect(res.status).toBe(400);
//           expect(res.body.message).toEqual("This book already exists");
//     })
//      it ("should edit a previous book", async()=>{
//           const lastBookIdq = allBooks[allBooks.length-1].bookId
//           const resLogin = await supertest(app).post(`/users/login`).send(logUser);
//           token = resLogin.body.token;
//           const res = await supertest(app)
//           .put(`/books/update/${lastBookIdq}`)
//           .send(secondBook)
//           .set("authorization", `Bearer ${token}`);
//           expect(res.status).toBe(200);
//           expect(res.body.message).toEqual("Book updated successfully");
//           expect(res.body.books).toHaveProperty("bookId")
//      })
//      it ("should not edit a previous book", async()=>{
//           //this happens when a wrong ID is inputed into the url
//           const resLogin = await supertest(app).post(`/users/login`).send(logUser);
//           token = resLogin.body.token;
//           const res = await supertest(app)
//           .put(`/books/update/${id2}`)
//           .send(secondBook)
//           .set("authorization", `Bearer ${token}`);
//           expect(res.status).toBe(400);
//           expect(res.body.message).toEqual("book not found");
//      })
//      it ("should get all books", async()=>{
//           const res = await supertest(app)
//           .get(`/books/display`)
//           expect(res.body.message).toBe('Here are the list of books available')
//      })
//      it ('should get a single book', async()=>{
//           const lastBookIda = allBooks[allBooks.length-1].bookId
//           const res = await supertest(app)
//           .get(`/books/book/${lastBookIda}`)
//           .set("authorization", `Bearer ${token}`);
//           expect(res.status).toBe(400);
//           expect(res.body.message).toBe('book not found')
//      })
//      it ('should not get a single book', async()=>{
//           const res = await supertest(app)
//           .get(`/books/book/${id2}`)
//           .set("authorization", `Bearer ${token}`);
//           expect(res.status).toBe(400);
//           expect(res.body.message).toBe('book not found')
//      })
//      it ("should delete a book", async()=>{
//           const lastBookIds = allBooks[allBooks.length-1].bookId
//           const res = await supertest(app)
//           .delete(`/books/delete/${lastBookIds}`)
//           .set("authorization", `Bearer ${token}`);
//           expect(res.status).toBe(200);
//           expect(res.body.message).toBe('Book deleted successfully')
//      })
//      it ("should not delete a book", async()=>{
//           const res = await supertest(app)
//           .delete(`/books/delete/${id2}`)
//           .set("authorization", `Bearer ${token}`);
//           expect(res.status).toBe(400);
//           expect(res.body.message).toBe('book with id: 12345 not found')
//      })
// });
// 
