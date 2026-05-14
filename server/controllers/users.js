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
            User.findById(id, { name: 1, picture: 1, bio: 1, createdAt: 1 }).lean(),
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
            bio: user.bio || null,
            joinedAt: user.createdAt || earliestPost?.createdAt || null,
            postCount,
        });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

/* PATCH /user/:id — sửa hồ sơ. Chỉ owner mới được sửa (req.userId === id).
   Whitelist field: name, bio, picture. Mọi field khác (email, password,
   googleId, _id, createdAt) bị BỎ — tránh leo quyền hoặc làm hỏng identity.

   Validation:
   - name: required nếu có, trim, 1-80 ký tự.
   - bio: optional, max 280 ký tự (có thể là chuỗi rỗng để xoá).
   - picture: optional, max 1024 ký tự (có thể rỗng để xoá avatar).

   Trả về shape giống GET /user/:id để client merge thẳng vào state.profile.viewed.
   `postCount` KHÔNG trả về (vì PATCH này không đổi số bài) — client giữ giá trị cũ. */
export const updateUserProfile = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ message: 'User not found' });
    }

    /* Owner check: dùng req.userId từ JWT (auth middleware đã verify).
       KHÔNG dùng giá trị từ body — tránh client gửi id khác để giả mạo. */
    if (String(req.userId) !== String(id)) {
        return res.status(403).json({ message: 'You can only edit your own profile' });
    }

    const { name, bio, picture } = req.body || {};
    const update = {};

    if (name != null) {
        if (typeof name !== 'string') {
            return res.status(400).json({ message: 'Name phải là chuỗi' });
        }
        const trimmed = name.trim();
        if (trimmed.length === 0 || trimmed.length > 80) {
            return res.status(400).json({ message: 'Name phải dài 1-80 ký tự' });
        }
        update.name = trimmed;
    }

    if (bio != null) {
        if (typeof bio !== 'string') {
            return res.status(400).json({ message: 'Bio phải là chuỗi' });
        }
        if (bio.length > 280) {
            return res.status(400).json({ message: 'Bio tối đa 280 ký tự' });
        }
        update.bio = bio;
    }

    if (picture != null) {
        if (typeof picture !== 'string') {
            return res.status(400).json({ message: 'Picture URL phải là chuỗi' });
        }
        const trimmed = picture.trim();
        if (trimmed.length > 1024) {
            return res.status(400).json({ message: 'Picture URL quá dài' });
        }
        update.picture = trimmed;
    }

    if (Object.keys(update).length === 0) {
        return res.status(400).json({ message: 'Không có thay đổi nào' });
    }

    try {
        const user = await User.findByIdAndUpdate(id, update, {
            new: true,
            runValidators: true,
            projection: { name: 1, picture: 1, bio: 1, createdAt: 1 },
        }).lean();

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        /* Lấy lại postCount để response có đủ shape giống getUserPublic.
           Trade-off: 1 query nhỏ mỗi lần edit (hiếm) — bù lại client không
           phải merge với state cũ. */
        const postCount = await PostMessage.countDocuments({ creator: String(id) });

        return res.json({
            _id: String(user._id),
            name: user.name,
            picture: user.picture || null,
            bio: user.bio || null,
            joinedAt: user.createdAt || null,
            postCount,
        });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

/* PATCH /user/me/password — đổi mật khẩu cho user local.
   Identity LẤY TỪ JWT (`req.userId`), không lấy từ body — tránh leo quyền.

   Đầu vào: { currentPassword, newPassword, confirmPassword }
   Logic:
   1. Tìm user theo `req.userId` (đã verify trong middleware `auth`).
   2. Nếu user CHƯA có `password` field → đây là Google-only user → 400
      với `code: 'NO_PASSWORD'` để FE hiển thị giao diện phù hợp ("đăng nhập
      bằng Google, không có mật khẩu local"). Không chuyển sang flow "set
      password" vì sẽ phải xử lý xác thực 2 bước (gửi email…) — out of scope MVP.
   3. `bcrypt.compare(currentPassword, user.password)` — sai → 400.
   4. Validate newPassword:
      - tối thiểu 6 ký tự (cùng ngưỡng với client để thông báo nhất quán)
      - không trùng currentPassword (đổi mà giống cũ là vô nghĩa)
      - === confirmPassword (defense-in-depth, FE cũng check rồi)
   5. Hash mới (bcrypt cost 12, cùng với signup) → save.

   Trả về 200 `{ message }` — KHÔNG trả password hash mới. Client không cần
   biết hash; JWT cũ vẫn valid nên user không bị đăng xuất. */
export const changePassword = async (req, res) => {
    if (!req.userId) {
        return res.status(401).json({ message: 'Unauthorized', code: 'NO_TOKEN' });
    }

    const { currentPassword, newPassword, confirmPassword } = req.body || {};

    if (
        typeof currentPassword !== 'string' ||
        typeof newPassword !== 'string' ||
        typeof confirmPassword !== 'string'
    ) {
        return res.status(400).json({ message: 'Thiếu trường mật khẩu' });
    }

    if (newPassword.length < 6) {
        return res.status(400).json({ message: 'Mật khẩu mới phải tối thiểu 6 ký tự' });
    }

    if (newPassword !== confirmPassword) {
        return res.status(400).json({ message: 'Mật khẩu xác nhận không khớp' });
    }

    if (newPassword === currentPassword) {
        return res.status(400).json({ message: 'Mật khẩu mới phải khác mật khẩu hiện tại' });
    }

    try {
        const user = await User.findById(req.userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (!user.password) {
            return res.status(400).json({
                message: 'Tài khoản này đăng nhập bằng Google nên không có mật khẩu local. Hãy đổi mật khẩu trên Google.',
                code: 'NO_PASSWORD',
            });
        }

        const ok = await bcrypt.compare(currentPassword, user.password);
        if (!ok) {
            return res.status(400).json({ message: 'Mật khẩu hiện tại không đúng' });
        }

        user.password = await bcrypt.hash(newPassword, 12);
        await user.save();

        return res.json({ message: 'Đổi mật khẩu thành công' });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};