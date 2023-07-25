"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const booksControllers_1 = require("../controller/booksControllers");
const auth_1 = require("../utilities/auth");
const router = express_1.default.Router();
router.post('/create', auth_1.auth, booksControllers_1.createBook);
router.put('/update/:id', auth_1.auth, booksControllers_1.upadateBook);
router.get('/display', booksControllers_1.getBooks);
// router.get('/book/:id', auth, getSingleBook);
// router.delete('/delete/:id', auth, deleteBook);
/* GET home page. */
// router.get('/', function(req: Request, res: Response, next: NextFunction ) {
//   res.render('index', { title: 'Express' });
// });
exports.default = router;
