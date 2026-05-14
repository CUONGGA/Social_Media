import express from 'express';
import { signin, signup, googleSignIn, getUserPublic } from '../controllers/users.js';
const router = express.Router();

router.post('/signin', signin);
router.post('/signup', signup);
router.post('/google', googleSignIn);
router.get('/:id', getUserPublic);

export default router;

