# Mở rộng dự án Memories (MERN)

Tài liệu ghi lại các hướng củng cố và mở rộng cho ứng dụng (React + Redux + MUI v4, Node/Express + MongoDB + JWT + Google OAuth).

**Backlog vấn đề cụ thể (bug / lỗ hổng / nợ kỹ thuật)** — đã + chưa giải quyết: [VanDeCanGiaiQuyet.md](./VanDeCanGiaiQuyet.md). File này (`MO_RONG_DU_AN.md`) viết theo **mục tiêu**; file kia liệt kê **vấn đề cụ thể** kèm severity/status — bổ sung nhau.

**Ý tưởng tính năng sản phẩm / UX** (dòng thời gian, album, map, v.v.): [Y_TUONG_TINH_NANG.md](./Y_TUONG_TINH_NANG.md).

**Phản ứng nhiều loại (tim, haha, …)** — tạm ngưng trên UI; gợi ý triển khai sau: [PHAN_UNG_DA_TRIEN_KHAI.md](./PHAN_UNG_DA_TRIEN_KHAI.md).

**Bình luận realtime (SSE) + Live like count + Phân quyền P0 + Trang hồ sơ MVP + Google user upsert** — đã triển khai (ngày 2: comment realtime, A1: live like, P0: khoá lỗ hổng edit/delete bất kỳ ai, Profile S: `/users/:id` + `/me`, PROF-1 Phase M: upsert + migrate Google → ObjectId); nhật ký gộp: [ngay2.md](./ngay2.md).

**Tách `relatedPosts` khỏi feed** — đã xử lý nháy "You might also like"; nhật ký: [ngay1.md](./ngay1.md).

**Giao diện sáng / tối** — đã có; tổng quan: [GIAO_DIEN_CHU_DE.md](./GIAO_DIEN_CHU_DE.md).

---

## Hiện trạng ngắn gọn

- **Client**: Router, trang Home (danh sách, form tạo bài, tìm kiếm theo tiêu đề/tags), Auth Google, chi tiết bài + comment, navbar, phân trang qua query `page`. Theme sáng/tối qua context + `localStorage`. Toast snackbar tập trung qua `ToastContext`. Chi tiết bài đăng ký **SSE** để nhận comment mới realtime.
- **Server**: CRUD post, like, comment (đang lưu dạng chuỗi), tìm kiếm regex, middleware JWT; ảnh thường là base64 trong document. Có lớp **pub/sub trong bộ nhớ** (`server/realtime/commentBus.js`) phát SSE `comment:new` khi commentPost thành công.

---

## 1. Bảo mật và môi trường production

- [ ] **`JWT_SECRET`**: Lấy từ biến môi trường, không hardcode trong repo.
- [x] **Phân quyền** *(P0 đã đóng — xem [ngay2.md § Phân quyền P0](./ngay2.md#phân-quyền-p0--khoá-lỗ-hổng-editdelete-bất-kỳ-ai))*: chỉ chủ bài được PATCH/DELETE (403 nếu khác owner); 404 khi post không tồn tại; 401 chuẩn khi thiếu/sai token; body không cho ghi đè `creator`.
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
- [ ] **`getPostsBySearch`**: `tags` có thể `undefined` → tránh `tags.split(',')` crash; thống nhất giá trị "rỗng" giữa client & server.

---

## 4. Realtime / Streaming

> Trạng thái: **Phạm vi S đã có** (live bình luận qua SSE — xem [ngay2.md](./ngay2.md)). Các mục dưới là việc tiếp theo nếu tiến lên Phạm vi M (DM) / Phạm vi L (notifications).

- [ ] **Auth trên stream**: hiện stream comment là public. Khi có bài "private" / DM phải verify JWT lúc `subscribe` (qua query `?token=...` hoặc cookie httpOnly).
- [ ] **Scale ngang**: `commentBus` đang là `Map` in-memory → khi chạy cluster phải đổi sang **Redis Pub/Sub** (giữ nguyên signature `subscribe / emit`).
- [ ] **Không bỏ sót khi reconnect**: SSE `Last-Event-ID` header + buffer event gần nhất (theo post). Hữu ích khi mạng chập chờn.
- [ ] **Bell / notifications**: kênh riêng `user:{id}` — emit khi bài của user được like/comment. Cần model `Notification` cho lịch sử.
- [x] **Live like count** — đã làm trong A1 cùng ngày, xem [ngay2.md § A1](./ngay2.md#a1--live-like-count-mở-rộng-cùng-ngày). Event `like:update { postId, likes[] }` tái dùng `commentBus` + stream sẵn có.
- [ ] **Typing indicator / DM 2 chiều**: lúc này nên cân nhắc đổi sang **Socket.IO** thay vì SSE (cần kênh client → server).
- [ ] **Heartbeat / idle timeout**: hiện tại 25s; theo dõi nếu reverse proxy production có idle ngắn hơn (Cloudflare 100s, AWS ALB 60s mặc định — đều OK).
- [ ] **Quan sát**: log số `roomSize` định kỳ để biết tải; cảnh báo nếu vượt ngưỡng (giúp quyết định lúc nào chuyển Redis).

---

## 5. Frontend (UX và kỹ thuật)

- [ ] **Feedback**: Toast/snackbar cho lỗi mạng/API; skeleton/empty state.
- [ ] **Google OAuth**: `clientId` qua env, không để placeholder trên repo công khai.
- [ ] **`REACT_APP_API_URL`**: Một nơi cấu hình cho mọi gọi API (dev/prod).
- [ ] **Nâng stack (trung hạn)**: Vite + MUI 5/6; thay `material-ui-chip-input` bằng component/tags chính thức hoặc tự build — giảm CSS override.
- [ ] **A11y**: `alt` ảnh, focus modal, contrast.

---

## 6. Tính năng sản phẩm (tùy mục tiêu)

- [x] **Trang hồ sơ MVP** — `/users/:id` + `/me`, lưới bài + ngày tham gia + số bài. Xem [ngay2.md — Trang hồ sơ](./ngay2.md#trang-hồ-sơ--phạm-vi-s-mvp-cùng-ngày).
- [x] **Hồ sơ — Phạm vi M (Google upsert)**: PROF-1 đã đóng — Google user có User doc trong DB, `post.creator` migrate sang ObjectId, frontend luôn dùng JWT local. Xem [ngay2.md § PROF-1 Phase M](./ngay2.md#prof-1-phase-m--google-user-upsert--dọn-fallback-cùng-ngày).
- [x] **Hồ sơ — Sửa hồ sơ (PROF-4 + PROF-5)**: dialog edit name + bio (≤280) + picture URL, owner-only (`PATCH /user/:id` server-side check), sync Navbar realtime qua dispatch `AUTH`. Xem [ngay2.md § PROF-5](./ngay2.md#prof-5--sửa-hồ-sơ-name--bio--picture-cùng-ngày).
- [ ] **Hồ sơ — Phạm vi M (còn lại)**: upload avatar thật (chờ D-1 file storage), populate `picture`/`name` cho Post card (chờ D-2 creator ref). PROF-3 (postCount sync) đi cùng A2.
- [ ] Theo dõi user / feed cá nhân.
- [ ] Thông báo; báo cáo nội dung; chặn user (moderation).
- [ ] Sửa/xóa comment, reply, mention.
- [ ] Tìm kiếm nâng cao: full-text MongoDB hoặc dịch vụ search nếu quy mô lớn.
- [ ] **DM 1-1** (Phạm vi M của realtime — Socket.IO, model `Conversation` + `Message`).

---

## 7. Chất lượng và vận hành

- [ ] **Tests**: Jest + RTL cho reducer; integration API; smoke E2E (Playwright/Cypress).
- [ ] **CI**: Lint + test trên PR.
- [ ] **Docker Compose**: App + Mongo cho dev/deploy nhất quán.
- [ ] **Logging** có cấu trúc; không log token hay PII nhạy cảm.

---

## Thứ tự gợi ý

1. Bảo mật JWT + phân quyền CRUD post.
2. Upload ảnh ra storage + URL trong DB.
3. Comment schema rõ ràng + mã HTTP chuẩn — đổi `comments: [String]` sang object `{ userId, name, text, createdAt }`. Khi đổi, **payload SSE `comment:new` cần cập nhật** theo cấu trúc mới (vẫn cùng key `comments`).
4. Đồng bộ search với URL (encode + hydrate state).
5. Env client/server (`JWT_SECRET`, `REACT_APP_API_URL`, Google client ID).
6. ~~Trang hồ sơ + "Bài viết của tôi"~~ — **MVP + Sửa hồ sơ (PROF-5) đã làm**. Còn upload avatar thật (chờ D-1), populate post.creator (chờ D-2).
7. Realtime mở rộng (Phạm vi M): DM 1-1 bằng Socket.IO; bell notifications dùng SSE kênh `user:{id}`.
8. Nâng dependency UI và tính năng social khi nền tảng đã vững.
