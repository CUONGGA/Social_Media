import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import User from "../models/user.js";
import PostMessage from "../models/postMessage.js";
import jwt from 'jsonwebtoken';



export const signin = async (req, res, next) => {
      const { email, password } = req.body;
      try {
        const existingUser = await User.findOne({email});

        if (!existingUser) return res.status(404).json({message: "User doesn't exist."});

        const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);

        if (!isPasswordCorrect) return res.status(400).json({ message: "Invalid credentials" });;

        const token = jwt.sign({ email: existingUser.email, id:existingUser._id }, 'test', {expiresIn: "1h"});

        res.status(200).json({result: existingUser, token});
      } catch (error) {
        res.status(500).json({message: "Something wrong~"});
      }
}

export const signup = async (req, res, next) => {
      const { email, password, confirmPassword, firstName, lastName} = req.body;

      try {
        const existingUser = await User.findOne({email});
        
        if (existingUser) return res.status(400).json({message: "User already exist."});

        if ( password !== confirmPassword ) return res.status(400).json({message: "Password not match."});

        const hashedPassword = await bcrypt.hash(password, 12);

        const result = await User.create({ email, password: hashedPassword, name: `${firstName} ${lastName}` });

        const token = jwt.sign({ email: result.email, id:result._id }, 'test', {expiresIn: "1h"});

        res.status(200).json({result, token});
      } catch {
        res.status(500).json({message: "Something wrong~"});
      }
}

/* POST /user/google — đăng nhập / đăng ký bằng Google.

   Frontend nhận `credential` (Google ID token, là 1 JWT) từ `@react-oauth/google`,
   POST sang đây kèm `{ token }`. Server:
   1. Decode token (KHÔNG verify chữ ký — đó là S-2, để pass riêng).
   2. Upsert User theo `googleId` (sub):
      - Nếu chưa có → create với name + email + picture + googleId.
      - Nếu đã có → update name + picture (đề phòng user đổi avatar/tên trên Google).
   3. Migration nhẹ: các post cũ có `creator = googleId` (chuỗi sub) →
      `updateMany` để đổi thành `User._id` string. Sau migration, mọi creator
      đều là ObjectId string → flow downstream chỉ cần xử lý 1 dạng.
   4. Trả về JWT **local** (cùng format với signin/signup) để frontend lưu
      thay vì Google idToken — đồng nhất 1 loại token, gỡ heuristic
      `token.length < 500` trong `auth` middleware.

   Lý do gộp upsert + migration vào 1 endpoint thay vì script offline:
   - Migration tự xảy ra ngay khi user đầu tiên login Google → không cần ops.
   - `updateMany` chỉ chạy lần đầu (sau đó creator đã ObjectId, không match
     query `{ creator: googleId }` nữa). */
export const googleSignIn = async (req, res) => {
    const { token } = req.body;

    if (!token) {
        return res.status(400).json({ message: 'Missing Google token' });
    }

    try {
        /* `jwt.decode` không cần secret/key — chỉ unwrap payload. Hoãn verify
           chữ ký tới S-2 (google-auth-library). Pre-S-2 vẫn tin cậy token như
           code cũ trong auth middleware. */
        const decoded = jwt.decode(token);

        if (!decoded?.sub || !decoded?.email) {
            return res.status(400).json({ message: 'Invalid Google token payload' });
        }

        const { sub: googleId, email, name, picture } = decoded;

        /* Upsert: tìm theo googleId trước, rồi mới tới email. Tránh tạo
           User mới khi user đã có document local cùng email (vd: trước đây
           đã signup bằng email/password, giờ login Google bằng cùng email).
           Logic merge:
           - Nếu User có googleId == sub → đó là user. Update profile.
           - Nếu không, tìm theo email. Nếu có → link googleId vào doc đó.
           - Cả hai không có → tạo mới. */
        let user = await User.findOne({ googleId });

        if (!user) {
            user = await User.findOne({ email });
            if (user) {
                user.googleId = googleId;
                user.picture = picture || user.picture;
                user.name = user.name || name; /* tôn trọng tên user đã đổi */
                await user.save();
            } else {
                user = await User.create({
                    name: name || email.split('@')[0],
                    email,
                    googleId,
                    picture,
                });
            }
        } else {
            /* User đã tồn tại theo googleId — refresh các field có thể đổi
               trên Google. Không đụng tới name nếu user đã đổi local
               (Phạm vi M tiếp theo). */
            user.picture = picture || user.picture;
            await user.save();
        }

        /* Migration: post cũ creator = sub → đổi thành User._id. Chạy
           không-điều-kiện vì idempotent (lần 2 sẽ matchedCount = 0). */
        await PostMessage.updateMany(
            { creator: String(googleId) },
            { $set: { creator: String(user._id) } },
        );

        const jwtToken = jwt.sign(
            { email: user.email, id: user._id },
            'test', /* TODO S-1: đổi sang process.env.JWT_SECRET */
            { expiresIn: '1h' },
        );

        return res.status(200).json({ result: user, token: jwtToken });
    } catch (err) {
        console.error('googleSignIn error:', err);
        return res.status(500).json({ message: 'Google sign-in failed' });
    }
};

/* GET /user/:id — trang hồ sơ công khai.
   Trả về thông tin "an toàn để hiển thị public":
   - name, joinedAt (createdAt), postCount, picture

   KHÔNG trả: email, password, googleId (PII).

   Sau pass PROF-1 Phase M, MỌI user (local + Google) đều có document trong
   `User` collection và `post.creator` luôn là ObjectId string. Không cần
   fallback theo posts như trước (xem git log nếu cần xem lại logic cũ). */
export const getUserPublic = async (req, res) => {
    const { id } = req.params;

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ message: 'User not found' });
    }

    try {
        const postFilter = { creator: String(id) };
        const [user, postCount, earliestPost] = await Promise.all([
            User.findById(id, { name: 1, picture: 1, createdAt: 1 }).lean(),
            PostMessage.countDocuments(postFilter),
            /* Earliest post để fallback `joinedAt` cho user CŨ: được tạo
               trước khi bật `timestamps: true` nên thiếu `createdAt`. */
            PostMessage.findOne(postFilter, { createdAt: 1 }).sort({ _id: 1 }).lean(),
        ]);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        return res.json({
            _id: String(user._id),
            name: user.name,
            picture: user.picture || null,
            joinedAt: user.createdAt || earliestPost?.createdAt || null,
            postCount,
        });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};