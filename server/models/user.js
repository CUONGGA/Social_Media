import mongoose from "mongoose";

const userSchema = mongoose.Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true },
        /* Password optional vì user đăng nhập qua Google không có password local.
           Local signup vẫn hash + lưu như cũ. */
        password: { type: String },
        /* Google `sub` (subject) — unique mỗi tài khoản Google. Dùng để upsert
           tránh tạo trùng khi user đăng nhập Google nhiều lần.
           - `sparse: true`: cho phép null/undefined không tham gia unique index
             → user signup local (không có googleId) không xung đột.
           - `unique: true`: 1 sub Google chỉ map đến 1 User document. */
        googleId: { type: String, index: { unique: true, sparse: true } },
        /* URL avatar lấy từ Google profile khi user signin lần đầu, hoặc do
           user tự nhập qua dialog "Sửa hồ sơ" (PROF-5). */
        picture: String,
        /* Tiểu sử ngắn, hiển thị trên Profile header. Giới hạn 280 ký tự
           (giống Twitter cũ) — đủ cho 1-2 câu mô tả ngắn. */
        bio: { type: String, maxlength: 280 },
        /* `id` cũ là field dư từ skeleton ban đầu — giữ optional để không phá
           document cũ trong DB. Có thể loại bỏ sau khi migrate. */
        id: String,
    },
    {
        /* `timestamps: true` tự thêm `createdAt` + `updatedAt`. User cũ trong
           DB sẽ thiếu `createdAt` → client phải fallback "Tham gia trước đây". */
        timestamps: true,
    },
);


const User = mongoose.model('User', userSchema);

export default User;

