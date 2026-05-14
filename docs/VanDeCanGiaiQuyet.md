# Vấn đề cần giải quyết — Backlog tổng hợp

> **Tài liệu này là gì.** Backlog **vấn đề cụ thể** (bug, lỗ hổng bảo mật, nợ kỹ thuật, hành vi sai chuẩn) phát hiện được từ đầu project đến hôm nay. Cả **đã giải quyết** lẫn **chưa giải quyết**.
>
> **Khác biệt với các tài liệu khác**:
> - [`MO_RONG_DU_AN.md`](./MO_RONG_DU_AN.md) → roadmap kỹ thuật theo **mục tiêu** (vd "bảo mật và production-ready").
> - [`Y_TUONG_TINH_NANG.md`](./Y_TUONG_TINH_NANG.md) → ý tưởng **tính năng sản phẩm** (vd timeline, album, map).
> - [`ngay1.md`](./ngay1.md), [`ngay2.md`](./ngay2.md) → **nhật ký theo ngày**: quyết định + cách triển khai chi tiết.
> - **File này** → **liệt kê và theo dõi vấn đề cụ thể** (bug nằm ở file/dòng nào, hành vi sai/đúng, hướng fix).
>
> Khi phát hiện vấn đề mới → ghi vào đây. Khi giải quyết → đổi trạng thái + thêm link đến nơi giải thích chi tiết (thường là `ngayN.md`).

## Quy ước

| Cột | Ý nghĩa |
|-----|---------|
| **Mức** | 🔴 critical (lỗ hổng / data loss / crash) · 🟠 important (perf đáng kể / sai chuẩn / blocker) · 🟡 polish (UX / future-proof) |
| **Trạng thái** | ✅ đã giải quyết · ⏳ pending · 🚫 cố ý hoãn (WONTFIX-for-now, kèm lý do) |

---

## Mục lục nhanh

- [1. Đã giải quyết](#1-đã-giải-quyết)
- [2. Chưa giải quyết](#2-chưa-giải-quyết)
  - [2.1 Bảo mật](#21-bảo-mật)
  - [2.2 Dữ liệu & schema](#22-dữ-liệu--schema)
  - [2.3 Hiệu năng & scale](#23-hiệu-năng--scale)
  - [2.4 Realtime — mở rộng](#24-realtime--mở-rộng)
  - [2.5 Frontend UX](#25-frontend-ux)
  - [2.6 API & hành vi HTTP](#26-api--hành-vi-http)
  - [2.7 Chất lượng & vận hành](#27-chất-lượng--vận-hành)
- [3. Cố ý hoãn / không làm hôm nay](#3-cố-ý-hoãn--không-làm-hôm-nay)
- [4. Tính năng sản phẩm](#4-tính-năng-sản-phẩm)
- [5. Khuyến nghị thứ tự xử lý](#5-khuyến-nghị-thứ-tự-xử-lý)

---

## 1. Đã giải quyết

### 1.1 Ngày 1 — Related posts (You might also like)

| # | Vấn đề | Mức | Giải pháp |
|---|--------|-----|-----------|
| D1-1 | "You might also like" nháy nội dung **sai** khi mở post mới (hiển thị related cũ vài giây trước khi cập nhật) | 🟠 | Tách `relatedPosts` ra khỏi feed; reducer thêm `relatedForPostId` để biết related đang gắn với post nào; UI chỉ render khi `relatedForPostId === current postId` ([ngay1.md](./ngay1.md)). |

### 1.2 Ngày 2 — Realtime + phân quyền + tối ưu

| # | Vấn đề | Mức | Giải pháp |
|---|--------|-----|-----------|
| D2-1 | Comment mới ở user A không hiện ở user B trên cùng trang chi tiết — phải F5 | 🟠 | SSE + in-memory pub/sub `commentBus`, endpoint `GET /posts/:id/comments/stream`. ([ngay2.md § Phạm vi S](./ngay2.md#nhật-ký-thay-đổi--ngày-2-14052026)) |
| D2-2 | CRA dev proxy **buffer** SSE → client không nhận event suốt thời gian connection mở | 🟠 | Client SSE trỏ thẳng `http://localhost:5000`, bỏ qua proxy ([ngay2.md § Gotcha](./ngay2.md#gotcha--cra-dev-proxy-buffer-sse)). |
| D2-3 | Server chạy `node index.js` không auto-reload → tưởng code mới bị hỏng | 🟠 | Khuyến nghị `npm run dev` (nodemon). Đã ghi nhận để không lặp lại. |
| D2-4 | Số like không cập nhật realtime cho người xem khác | 🟡 | A1 — emit `like:update` qua `commentBus` sẵn có; reducer LIKE chuyển sang **merge** để hỗ trợ partial payload. ([ngay2.md § A1](./ngay2.md#a1--live-like-count-mở-rộng-cùng-ngày)) |
| D2-5 | **`PATCH /posts/:id`**: bất kỳ user đã login đều **edit được bài của người khác** | 🔴 | Helper `loadPostAsOwner` → 403 nếu khác `creator`, 404 nếu không tồn tại. ([ngay2.md § Phân quyền P0](./ngay2.md#phân-quyền-p0--khoá-lỗ-hổng-editdelete-bất-kỳ-ai)) |
| D2-6 | **`DELETE /posts/:id`**: tương tự — xoá được bài người khác | 🔴 | Cùng helper trên. |
| D2-7 | `updatePost`: body có thể ghi đè `creator` → leo quyền | 🔴 | Sanitize: loại `creator` và `_id` khỏi body trước `findByIdAndUpdate`. |
| D2-8 | `auth` middleware trả **500** khi token thiếu/sai (đáng ra 401) | 🟠 | Trả 401 kèm `code: 'NO_TOKEN' \| 'BAD_TOKEN'`; hỗ trợ Bearer prefix. |
| D2-9 | `likePost` / `commentPost` trả **200 OK** với message `"Unauthenticated"` khi thiếu userId | 🟠 | Trả 401 chuẩn. |
| D2-10 | `likePost` / `commentPost` **crash 500** khi post đã bị xoá (`post.likes.findIndex` trên `null`) | 🟠 | Check `findById` null → 404. |
| D2-11 | Click like cảm giác chậm (~100–500ms mới đổi số) | 🟠 | Optimistic update ở client (`actions/posts.js`) + slim server response `{_id, likes}` + atomic `$addToSet`/`$pull`. ([ngay2.md § Tối ưu like](./ngay2.md#tối-ưu-like--fast-feedback-cùng-ngày)) |
| D2-12 | **BUG nặng**: `getposts` có dòng `const postMessage = await PostMessage.find();` fetch toàn bộ DB (gồm base64 ảnh) rồi vứt vào biến không dùng → mỗi load Home đốt MB IO vô ích | 🔴 | Đã xoá; `Promise.all` count+find; `.lean()`. ([ngay2.md § Tối ưu load posts](./ngay2.md#tối-ưu-load-posts-cùng-ngày)) |
| D2-13 | Không có `compression` middleware → response JSON không gzip | 🟠 | Thêm `compression` + filter loại trừ SSE route theo URL. |
| D2-14 | `getPostsBySearch` không `.limit()` → kéo all matching (có thể hàng ngàn bài) | 🟠 | `.limit(20)` + `.sort({_id: -1})` + `.lean()` + defensive `tags`/`searchQuery` undefined. |
| D2-15 | `getPostsBySearch` crash 500 khi `tags` undefined (`.split` trên null) | 🟠 | Guard tagList + searchQuery; query rỗng → trả `[]` sớm. |
| D2-16 | `getPost` trả `200 + null` khi post không tồn tại; không validate ObjectId | 🟡 | Validate `ObjectId.isValid` + null check → 404. |
| D2-17 | Logic `getUserId` lặp ở `Post.js` và `actions/posts.js` (sau A1) | 🟡 | Tách `client/src/utils/authUser.js` dùng chung. |

---

## 2. Chưa giải quyết

### 2.1 Bảo mật

| # | Mức | Vấn đề | Hướng / Ghi chú |
|---|-----|--------|-----------------|
| S-1 | 🔴 | **`JWT_SECRET` hardcoded** `'test'` trong `middleware/auth.js` và `controllers/users.js`. Ai có quyền đọc repo đều **forge token** được — đăng nhập dưới danh nghĩa user bất kỳ. | Lấy từ `process.env.JWT_SECRET`; thêm `.env.example`; throw nếu thiếu khi `NODE_ENV=production`. |
| S-2 | 🔴 | **Google OAuth token chỉ `jwt.decode`**, không verify chữ ký. Attacker có thể tự craft token với `sub` bất kỳ → impersonate user Google. | Dùng `google-auth-library` (`OAuth2Client.verifyIdToken({ idToken, audience: CLIENT_ID })`). |
| S-3 | 🟠 | **CORS mở rộng** `app.use(cors())` — cho phép mọi origin. Production cần whitelist domain. | `cors({ origin: process.env.CLIENT_URL, credentials: true })`. |
| S-4 | 🟠 | **Không có rate limit**: spam like/comment, brute-force login đều khả thi. | `express-rate-limit` global + chặt hơn cho `/user/signin`. |
| S-5 | 🟠 | **Không có `helmet`** → thiếu security headers (CSP, HSTS, X-Frame-Options…). | `app.use(helmet())` trước routes. CSP cần cấu hình cẩn thận với ảnh base64 + Google OAuth iframe. |
| S-6 | 🟠 | **Không có validation đầu vào**: title/message/tags có thể cực dài, ký tự bất kỳ, payload tới 30MB. | `express-validator` hoặc Zod cho mỗi POST/PATCH. Đặt giới hạn rõ (title ≤200, message ≤10k, tags ≤20 items). |
| S-7 | 🟠 | **HTTPS** chưa bắt buộc. Token JWT bay plaintext trên LAN dev OK, production phải có TLS terminator. | Reverse proxy (nginx/Caddy/PaaS) + `app.set('trust proxy', 1)`. |
| S-8 | 🟡 | Token `expiresIn: '1h'`, **không có refresh token**. User phải đăng nhập lại mỗi 1 giờ. Sau khi expired, request đầu tiên trả 401 → toast lỗi không thân thiện. | Refresh-token flow (httpOnly cookie) — task lớn. Tạm thời client nên catch 401 → auto-redirect signin. |
| S-9 | 🟡 | `auth` middleware phân biệt token bằng `token.length < 500` (custom vs Google) — heuristic mong manh. | Tách 2 endpoint hoặc dùng claim trong payload (`iss`). |
| S-10 | 🟡 | **`console.log('👉 HIT: ...')`** ghi mọi request kèm URL ra stdout — bị disclose ở production logs. | Loại trừ khi `NODE_ENV=production` hoặc dùng `morgan` với format thích hợp. |
| S-11 | 🟡 | npm audit báo **1 moderate + 2 high vulnerabilities** sau khi cài `compression`. | `npm audit fix` (kiểm tra major bump trước). |

### 2.2 Dữ liệu & schema

| # | Mức | Vấn đề | Hướng |
|---|-----|--------|-------|
| D-1 | 🔴 | **Ảnh `selectedFile` là base64 nhúng MongoDB**. Mỗi post 0.5–5MB. Load Home (9 post) = 5–45MB JSON. Backup/replica đắt. Càng dùng càng phình. | Chuyển sang file storage (S3/Cloudinary/local + URL). Refactor: upload endpoint + lưu URL trong field `imageUrl`; migrate dữ liệu cũ. |
| D-2 | 🟠 | **`creator: String`** — không phải `ObjectId ref User`. Không join được; mọi compare phải `String()`. | Đổi schema → `creator: { type: ObjectId, ref: 'User' }`; migrate dữ liệu cũ; `populate('creator')` khi cần `name`/`avatar`. |
| D-3 | 🟠 | **`comments: [String]`** dạng `"Tên: nội dung"` encode trong string. Không edit/xoá/reply/mention từng comment được. | Đổi thành object `{ _id, userId, name, text, createdAt }`. SSE payload giữ key `comments` để forward-compatible (xem [ngay2.md § Khi schema comment đổi](./ngay2.md#khi-schema-comment-đổi-lưu-ý-forward-compatible)). |
| D-4 | 🟠 | **Không có index MongoDB** trên `tags`, `createdAt`, `creator`. Search regex `title` chậm khi DB lớn. | Tạo index: `{ tags: 1 }`, `{ createdAt: -1 }`, `{ creator: 1 }`. Tìm kiếm full-text: `{ title: 'text', message: 'text' }`. |
| D-5 | 🟡 | Schema không có `updatedAt` (chỉ `createdAt`). | `timestamps: true` trong Mongoose schema. |

### 2.3 Hiệu năng & scale

| # | Mức | Vấn đề | Hướng |
|---|-----|--------|-------|
| P-1 | 🟠 | **Skip-based pagination** (`skip(n).limit(LIMIT)`): page càng lớn càng chậm vì Mongo phải bỏ qua n doc. | Cursor pagination: `find({ _id: { $lt: lastSeen } }).limit(LIMIT)`. Cần phải bỏ "jump to page N" UI (chấp nhận được cho feed). |
| P-2 | 🟡 | **`countDocuments({})`** quét toàn collection để tính `numberOfPages`. Chậm khi >100k doc. | `estimatedDocumentCount()` (nhanh, không chính xác 100%) hoặc cache count, hoặc bỏ "tổng số trang" trong UI. |
| P-3 | 🟠 | **Comment chậm** cùng pattern với like trước khi tối ưu: thiếu optimistic update; server trả full post. | Áp dụng cùng cách như D2-11: optimistic dispatch + slim payload `{ _id, comments }`. Reducer COMMENT/UPDATE cần đổi sang merge nếu chưa. |
| P-4 | 🟡 | **Self-broadcast SSE**: client A nhận lại event của chính mình (sau khi đã optimistic update) → render thừa. | Thêm `actorId` vào payload; client so với `user.result._id`, trùng thì skip. |
| P-5 | 🟡 | **Home grid không có live update** (cố ý). Khi DB nhỏ có thể cân nhắc bật. | 1 broadcast channel chung, server lọc theo `currentPage`. Cần đo: chấp nhận 9+ EventSource hay không. |

### 2.4 Realtime — mở rộng

| # | Mức | Vấn đề | Hướng |
|---|-----|--------|-------|
| R-1 | 🟠 | **Auth trên stream**: hiện `GET /posts/:id/comments/stream` là public. Khi có bài private hoặc DM phải verify JWT lúc subscribe. | Token qua query `?token=`; middleware `authFromQuery`. Đã có dự thảo trong [ngay2.md § A2 đề xuất](./ngay2.md#a2--bell-notifications-đề-xuất-chưa-triển-khai). |
| R-2 | 🟠 | **`commentBus` in-memory** không scale ngang. Khi chạy ≥2 instance Express, user kết nối instance A không nhận event từ instance B. | Redis Pub/Sub backend, giữ nguyên signature `subscribe`/`emit`. |
| R-3 | 🟡 | **Không có `Last-Event-ID`** — reconnect sau khi mạng đứt sẽ bỏ sót event xảy ra trong lúc đứt. | Server lưu buffer ring nhỏ theo `scopeKey`; client gửi `Last-Event-ID` header khi reconnect. |
| R-4 | 🟡 | **Bell / notifications**: bài của user X bị like/comment chưa có thông báo. | A2 đề xuất, xem [ngay2.md § A2](./ngay2.md#a2--bell-notifications-đề-xuất-chưa-triển-khai). |
| R-5 | 🟡 | **Quan sát**: không log `roomSize` định kỳ → không biết tải bus như nào. | Log `roomSize` mỗi 60s; cảnh báo khi vượt ngưỡng. |
| R-6 | 🟡 | **Heartbeat 25s** chọn arbitrary. Production sau Cloudflare/ALB cần kiểm tra idle timeout thực tế. | Đo + chỉnh nếu cần (Cloudflare 100s, AWS ALB 60s mặc định — 25s OK). |

### 2.5 Frontend UX

| # | Mức | Vấn đề | Hướng |
|---|-----|--------|-------|
| F-1 | 🟠 | **`REACT_APP_API_URL` không có file env mẫu**, không có fallback. Hiện `axios` create với `baseURL: undefined` → relative path (hoạt động qua CRA proxy nhưng dễ nhầm khi deploy). | Tạo `.env.example`; `axios.create({ baseURL: process.env.REACT_APP_API_URL \|\| 'http://localhost:5000' })`. Đồng bộ với `commentStream.js`. |
| F-2 | 🟠 | **Không có loading skeleton** — chỉ có `CircularProgress` toàn trang. Cảm giác blank trước khi data về. | MUI `<Skeleton>` cho card grid + post detail. |
| F-3 | 🟡 | **Anti-flash theme script chưa thêm** vào `public/index.html`. Trang load có thể flash trắng → tối hoặc ngược lại. | Inline script đọc `localStorage` đặt class `data-theme` trước React mount. Đã ghi nhận ở [GIAO_DIEN_CHU_DE.md](./GIAO_DIEN_CHU_DE.md) nhưng chưa làm. |
| F-4 | 🟡 | **Không có empty state**: Home trống → blank; search 0 kết quả → blank. | Thêm "Chưa có kỷ niệm nào" / "Không tìm thấy". |
| F-5 | 🟡 | **Không có error boundary** — exception trong React component → trắng trang. | `<ErrorBoundary>` ở App root. |
| F-6 | 🟡 | **Không có 404 page**: route không khớp → blank. | `<Route path="*" component={NotFound} />`. |
| F-7 | 🟡 | **A11y**: ảnh thiếu alt mô tả thật (toàn `alt=""` hoặc `alt={title}`); modal/menu thiếu focus trap; contrast màu xám/text chưa kiểm. | Audit bằng axe-core / Lighthouse. |
| F-8 | 🟡 | **Google OAuth `clientId` placeholder hardcode trong client** — nếu push public repo sẽ leak (dù không phải secret). | Đẩy qua `REACT_APP_GOOGLE_CLIENT_ID`. |
| F-9 | 🟡 | **MUI v4 lỗi thời**; `material-ui-chip-input` không maintain. | Trung hạn: nâng MUI v5/6 (breaking nhiều). Tách task lớn. |
| F-10 | 🟡 | **Search query không persist trong URL**: F5 mất hết bộ lọc. | Đẩy `searchQuery`/`tags` vào URL `?q=&tags=`; component hydrate state từ URL khi mount. |

### 2.6 API & hành vi HTTP

| # | Mức | Vấn đề | Hướng |
|---|-----|--------|-------|
| A-1 | 🟠 | **`encodeURIComponent`** chưa được dùng nhất quán cho `searchQuery` và `tags` khi đẩy vào URL. Ký tự đặc biệt (`&`, `?`) phá query string. | `encodeURIComponent` ở `actions`/`api/index.js`. |
| A-2 | 🟡 | **Endpoint `/user/signin` và `/user/signup`** không trả status code chuẩn cho lỗi nghiệp vụ (vd "User doesn't exist" trả 404 — đúng/sai tuỳ tranh luận, nhưng 400/401 phổ biến hơn). | Review + thống nhất. |
| A-3 | 🟡 | **Response error body không nhất quán**: chỗ trả `{ message }`, chỗ trả `'Not Found!'` chuỗi trần. | Thống nhất `{ message, code? }` (đã làm cho `auth` middleware). |

### 2.7 Chất lượng & vận hành

| # | Mức | Vấn đề | Hướng |
|---|-----|--------|-------|
| Q-1 | 🟠 | **Không có test**: zero unit/integration/E2E. Mọi thay đổi đều test tay → tốn thời gian, dễ sót regression. | Bắt đầu nhỏ: Jest cho reducer (`reducers/posts.js`); supertest cho 1-2 endpoint quan trọng (`likePost`, `auth`). |
| Q-2 | 🟠 | **Không có CI**. Push code không có gate. | GitHub Actions: `npm ci && npm test && eslint` cho cả `client/` và `server/`. |
| Q-3 | 🟡 | **Không có Docker Compose** cho dev đồng bộ giữa máy. | `docker-compose.yml`: client + server + mongo. |
| Q-4 | 🟡 | **Logging không cấu trúc** (`console.log` rải rác). Khi gặp lỗi production khó truy. | `pino` hoặc `winston` với JSON output; log level theo env; KHÔNG log token / password. |
| Q-5 | 🟡 | **`body-parser` còn trong `package.json`** nhưng Express 5 có `express.json` built-in. Dependency thừa. | `npm uninstall body-parser`. |

---

## 3. Cố ý hoãn / không làm hôm nay

| # | Việc | Lý do hoãn |
|---|------|------------|
| W-1 | 🚫 **Phản ứng nhiều loại** (❤️ 😂 🙏 thay vì chỉ "Like") | Quyết định sản phẩm — xem [PHAN_UNG_DA_TRIEN_KHAI.md](./PHAN_UNG_DA_TRIEN_KHAI.md). Cần auth vững + schema reaction trước. |
| W-2 | 🚫 **Live like trên Home grid** | Cố ý: tránh 9 EventSource song song. Cần đo cost trước khi bật. |
| W-3 | 🚫 **Đổi tên `commentBus` → `realtimeBus`** | Hoãn tới khi làm A2 — lúc đó có 2 scope (post + user), tên mới mới hợp nghĩa. Tránh churn giữa các pass. |
| W-4 | 🚫 **Projection bỏ `selectedFile`** ở list endpoint | UI grid đang dùng ảnh để render. Bỏ là vỡ UI. Fix đúng là D-1 (file storage). |
| W-5 | 🚫 **Cursor pagination** (P-1) | DB còn nhỏ, skip vẫn ổn. Đổi khi vượt vài nghìn post. |

---

## 4. Tính năng sản phẩm

Không liệt kê chi tiết ở đây — đã có riêng [Y_TUONG_TINH_NANG.md](./Y_TUONG_TINH_NANG.md). Tóm tắt cụm chưa làm:

- Timeline, album, "on this day", ngày kỷ niệm
- Bản đồ kỷ niệm (geolocation)
- Trang hồ sơ user + "Bài viết của tôi" + follow
- Bookmark / lưu bài người khác
- DM 1-1 (phạm vi M của realtime — cần Socket.IO)
- Sửa/xoá comment, reply, mention (cần D-3 trước)
- Carousel nhiều ảnh / draft / template gợi ý

---

## 5. Khuyến nghị thứ tự xử lý

### Tier 1 — Phải làm trước khi deploy thực tế

1. **S-1** JWT_SECRET → env (~20 phút).
2. **S-2** Google OAuth verify chữ ký (~1h, có thư viện).
3. **S-3 → S-7** CORS/rate-limit/helmet/validation/HTTPS (gom 1 pass, ~2h).
4. **D-1** Upload ảnh ra file storage (~3-6h tuỳ chọn — đây là pass lớn nhất; nên có sandbox account Cloudinary/S3 trước).
5. **Q-2** CI tối thiểu (lint + 1 test smoke) (~1h).

### Tier 2 — Làm để hệ thống bền

6. **D-2** `creator` → ObjectId ref (~1h + migrate).
7. **D-3** Comment schema → object (~1.5h + migrate, **xong cái này mới làm được F-7 reply/mention**).
8. **F-1** REACT_APP_API_URL chuẩn hoá (~30 phút).
9. **P-3** Tối ưu comment (cùng pattern like) (~30 phút).
10. **Q-1** Test cho reducer + auth middleware (~2h).

### Tier 3 — Mở rộng tính năng

11. **R-1 + R-4** A2 Bell notifications (auth stream + per-user channel) (~2-3h).
12. Trang profile + "Bài viết của tôi" (cần D-2 trước).
13. A2.5 Persist notifications trong DB (cần D-1, D-2).
14. DM 1-1 (cần Socket.IO).
15. Tính năng sản phẩm theo [Y_TUONG_TINH_NANG.md](./Y_TUONG_TINH_NANG.md).

### Tier 4 — Khi scale

16. **P-1, P-2** Cursor pagination + estimated count.
17. **R-2** Redis Pub/Sub thay in-memory bus.
18. **F-9** Nâng MUI v5/6 + Vite (task riêng, breaking).

---

## Lịch sử cập nhật

- **14/05/2026** — Tạo file. Tổng hợp 17 vấn đề đã giải quyết (D1-1, D2-1..D2-17), 38 vấn đề chưa giải quyết (S/D/P/R/F/A/Q), 5 quyết định cố ý hoãn.
