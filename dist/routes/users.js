"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const usersController_1 = require("../controller/usersController");
const router = express_1.default.Router();
router.post('/signup', usersController_1.createUser);
router.post("/login", usersController_1.login);
router.get("/getBooks", usersController_1.getAllUsers);
router.get("/getBook", usersController_1.getSingleUser);
exports.default = router;
// router.get('/', function(req: Request, res: Response, next: NextFunction) {
//   res.send('respond with a resource');
// });
