import express from "express";
import { createUser, login, getAllUsers, getSingleUser, deleteUser } from "../controller/usersController";
import { auth } from "../utilities/auth"


const router = express.Router();

router.post('/signup', createUser)
router.post('/login', login)
router.get("/getUsers", auth, getAllUsers)
router.get("/getUser", auth,  getSingleUser)
router.delete("/deleteUser/:_id", auth, deleteUser)




export default router
// router.get('/', function(req: Request, res: Response, next: NextFunction) {
//   res.send('respond with a resource');
// });

