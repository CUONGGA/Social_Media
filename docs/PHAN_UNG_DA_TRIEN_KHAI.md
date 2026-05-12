# Phản ứng ngoài Like — tạm ngưng

**Trạng thái (hiện tại):** UI chỉ dùng **Like** cổ điển (`post.likes`, `PATCH /posts/:id/likePost` không body). Tính năng nhiều loại phản ứng (tim, haha, lạy, v.v.) **chưa triển khai / tạm hoãn** — bạn có thể làm sau.

**Gợi ý khi làm lại (ngắn):**

- **MongoDB:** thêm mảng `reactions` với field **`reactionType`** (tránh đặt tên field con là `type` trong schema Mongoose).
- **API:** body hoặc query `type`; đăng ký route `PATCH /:id/likePost` **trước** `PATCH /:id`.
- **Client:** `utils/reactions.js` (gộp legacy `likes`), hàng icon hoặc popover; Redux vẫn có thể dùng action `LIKE` với payload bài mới.

Chi tiết ý tưởng: [Y_TUONG_TINH_NANG.md](./Y_TUONG_TINH_NANG.md).
