
import express from 'express'
const router = express.Router();
import {test, updateUser,deleteUser, getUserListing,getUser} from '../controllers/user.controller.js'
import { verifyUser } from '../utils/verifyUser.js';

router.get('/',test);
router.post('/update/:id',verifyUser, updateUser);
router.delete('/delete/:id',verifyUser, deleteUser);
router.get('/listings/:id',verifyUser,getUserListing);
router.get('/:id',verifyUser,getUser)
export default router;