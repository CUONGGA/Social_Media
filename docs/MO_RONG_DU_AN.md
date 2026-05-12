# Mở rộng dự án Memories (MERN)

Tài liệu ghi lại các hướng củng cố và mở rộng cho ứng dụng (React + Redux + MUI v4, Node/Express + MongoDB + JWT + Google OAuth).

**Ý tưởng tính năng sản phẩm / UX** (dòng thời gian, album, map, v.v.): [Y_TUONG_TINH_NANG.md](./Y_TUONG_TINH_NANG.md).

---

## Hiện trạng ngắn gọn

- **Client**: Router, trang Home (danh sách, form tạo bài, tìm kiếm theo tiêu đề/tags), Auth Google, chi tiết bài + comment, navbar, phân trang qua query `page`.
- **Server**: CRUD post, like, comment (đang lưu dạng chuỗi), tìm kiếm regex, middleware JWT; ảnh thường là base64 trong document.

---

## 1. Bảo mật và môi trường production

- [ ] **`JWT_SECRET`**: Lấy từ biến môi trường, không hardcode trong repo.
- [ ] **Phân quyền**: Chỉ chủ bài viết (hoặc admin) được sửa/xóa; quy tắc rõ cho like/comment (ví dụ bắt buộc đăng nhập).
- [ ] **Validation**: `express-validator`, Joi, hoặc Zod — giới hạn độ dài title/message, tags, kích thước body.
- [ ] **Rate limiting**, **helmet**, **CORS** chặt theo domain deploy.
- [ ] **HTTPS**; nếu dùng cookie cho token thì `httpOnly`, `secure`, `sameSite` phù hợp.

---

## 2. Lưu trữ và hiệu năng

- [ ] **Upload ảnh**: Cloudinary, S3, hoặc GridFS — lưu URL trong DB thay vì base64 lớn.
- [ ] **Comment có cấu trúc**: Mảng object `{ userId, name, text, createdAt }` thay vì encode `"userId: text"`.
- [ ] **Index MongoDB**: `title`, `tags`, `createdAt` (và các trường filter/sort thường dùng).

---

## 3. API và hành vi HTTP

- [ ] **Mã lỗi chuẩn**: 401 khi thiếu token; 403 khi không đủ quyền; 404 khi không có post.
- [ ] **URL tìm kiếm**: `encodeURIComponent` cho `searchQuery` và `tags` khi đẩy lịch sử; đồng bộ state form với URL khi F5 tại `/posts/search?...`.
- [ ] **Edge case**: Chuỗi tags rỗng / khoảng trắng — thống nhất client và server.

---

## 4. Frontend (UX và kỹ thuật)

- [ ] **Feedback**: Toast/snackbar cho lỗi mạng/API; skeleton/empty state.
- [ ] **Google OAuth**: `clientId` qua env, không để placeholder trên repo công khai.
- [ ] **`REACT_APP_API_URL`**: Một nơi cấu hình cho mọi gọi API (dev/prod).
- [ ] **Nâng stack (trung hạn)**: Vite + MUI 5/6; thay `material-ui-chip-input` bằng component/tags chính thức hoặc tự build — giảm CSS override.
- [ ] **A11y**: `alt` ảnh, focus modal, contrast.

---

## 5. Tính năng sản phẩm (tùy mục tiêu)

- [ ] Hồ sơ user, đổi tên/avatar.
- [ ] Trang “Bài viết của tôi”.
- [ ] Theo dõi user / feed cá nhân.
- [ ] Thông báo; báo cáo nội dung; chặn user (moderation).
- [ ] Sửa/xóa comment, reply, mention.
- [ ] Tìm kiếm nâng cao: full-text MongoDB hoặc dịch vụ search nếu quy mô lớn.

---

## 6. Chất lượng và vận hành

- [ ] **Tests**: Jest + RTL cho reducer; integration API; smoke E2E (Playwright/Cypress).
- [ ] **CI**: Lint + test trên PR.
- [ ] **Docker Compose**: App + Mongo cho dev/deploy nhất quán.
- [ ] **Logging** có cấu trúc; không log token hay PII nhạy cảm.

---

## Thứ tự gợi ý

1. Bảo mật JWT + phân quyền CRUD post.  
2. Upload ảnh ra storage + URL trong DB.  
3. Comment schema rõ ràng + mã HTTP chuẩn.  
4. Đồng bộ search với URL (encode + hydrate state).  
5. Env client/server (`JWT_SECRET`, `REACT_APP_API_URL`, Google client ID).  
6. Nâng dependency UI và tính năng social khi nền tảng đã vững.
