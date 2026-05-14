import express from 'express';
import {
    signin,
    signup,
    googleSignIn,
    getUserPublic,
    updateUserProfile,
    changePassword,
} from '../controllers/users.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.post('/signin', signin);
router.post('/signup', signup);
router.post('/google', googleSignIn);
/* `/me/password` PHẢI đặt TRƯỚC `/:id` về thứ tự khai báo? Không cần —
   `/:id` chỉ match đúng 1 segment, còn `/me/password` có 2 segment nên
   không bao giờ va chạm. Vẫn đặt ở đây để gần nhóm route /user/me-* khi
   sau này mở rộng (ví dụ /me, /me/email…). */
router.patch('/me/password', auth, changePassword);
router.get('/:id', getUserPublic);
/* PATCH /:id: chỉ owner mới được sửa — middleware `auth` set req.userId, controller
   so sánh với :id để chặn user khác. */
router.patch('/:id', auth, updateUserProfile);

export default router;

