import express from "express";
import { createBook, getBooks, updateBook, getSingleBook, deleteBook } from "../controller/booksControllers";
import { auth } from "../utilities/auth";

const router = express.Router();



router.post('/create', auth, createBook);
router.put('/update/:_id', auth, updateBook);
router.get('/display', auth, getBooks);
router.get('/oneBook/:_id', auth, getSingleBook);
router.delete('/delete/:_id', auth, deleteBook);

/* GET home page. */
// router.get('/', function(req: Request, res: Response, next: NextFunction ) {
//   res.render('index', { title: 'Express' });
// });

export default router   
