import express from 'express';
import { signin, signup } from '../controllers/users.js';
const router = express.Router();

router.post('/signin', signin);
router.post('/signup', signup);
router.post('/google', (req, res, next) => {
    res.json({ message: "Google login!" });
})


export default router;