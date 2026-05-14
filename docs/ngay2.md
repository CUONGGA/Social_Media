# Nhật ký thay đổi — ngày 2 (14/05/2026)

## Mục tiêu

- Triển khai **Phạm vi S** của hướng "chat realtime" (xem `Y_TUONG_TINH_NANG.md` mục tương tác xã hội): khi nhiều người cùng xem một bài viết, **bình luận mới hiện tức thời** mà không cần refresh trang.
- Không thêm dependency lớn, không phá kiến trúc đã có (related posts từ `ngay1.md`).

## Quyết định kỹ thuật

| Tiêu chí | Lựa chọn | Lý do |
|----------|----------|-------|
| Giao thức | **SSE** (`EventSource`) | Một chiều server → client, đủ cho live comments; không cần Socket.IO ở phạm vi này. |
| Lưu trữ tin | **MongoDB hiện hữu** | Comment vẫn lưu trong `PostMessage.comments` như cũ — SSE chỉ phát kèm khi có thay đổi. |
| Pub/sub | **In-memory** (`Map<postId, Set<res>>`) | Đủ cho 1 process Express. Khi scale ngang sẽ phải đổi sang Redis Pub/Sub. |
| Auth | **Không yêu cầu** trên stream | Trang chi tiết là public; chỉ POST comment mới cần JWT (giữ nguyên). |
| Reconnect | **Built-in** của `EventSource` | Trình duyệt tự reconnect khi mất kết nối. |

Không dùng polling và không dùng Socket.IO vì sẽ nặng hơn nhu cầu thực tế của Phạm vi S.

## Kiến trúc

```
┌────────────────────────┐                        ┌──────────────────────────┐
│  PostDetails (client)  │                        │  Express  (server)       │
│                        │                        │                          │
│  CommentSection        │  EventSource           │  GET /posts/:id          │
│   useEffect:           │ ──────────────────────▶│       /comments/stream   │
│    openCommentStream() │                        │   (text/event-stream)    │
│                        │ ◀──────────────────────│   subscribe(postId, res) │
│   onNewComment →       │  event: comment:new    │                          │
│    setComments(srv)    │                        │  POST /posts/:id/        │
│                        │                        │       commentPost        │
│   POST comment ────────┼────────────────────────▶│   save → emit('comment: │
│                        │                        │   new', { comments })    │
└────────────────────────┘                        └──────────────────────────┘
                                                        │
                                                        ▼
                                          ┌────────────────────────┐
                                          │ commentBus (in-memory) │
                                          │ rooms = Map<id, Set>   │
                                          └────────────────────────┘
```

## Hợp đồng SSE

Endpoint: `GET /posts/:id/comments/stream`
- `Content-Type: text/event-stream; charset=utf-8`
- `Cache-Control: no-cache, no-transform`
- `Connection: keep-alive`
- `X-Accel-Buffering: no` (tắt buffering nginx nếu có proxy)

Events được phát:

| Event | Khi nào | Payload |
|-------|---------|---------|
| `ready` | Ngay sau khi client kết nối | `{ postId: string }` |
| (heartbeat) | Mỗi 25s | comment-only `: ping` (giữ kết nối) |
| `comment:new` | Khi controller `commentPost` lưu xong | `{ postId: string, comment: string, comments: string[] }` |

**Quy ước payload:**
- `comments` luôn là **mảng canonical từ DB sau khi update**, client thường replace nguyên cụm vào state. Không phải merge.
- `comment` là string đơn lẻ vừa thêm (định dạng `"Tên: nội dung"` như hiện tại), để dành cho tương lai (animation "vừa được gửi").

## File đã chạm

| File | Thay đổi |
|------|----------|
| `server/realtime/commentBus.js` *(mới)* | Pub/sub trong bộ nhớ với `subscribe`, `unsubscribe`, `emit`, `roomSize`. |
| `server/controllers/posts.js` | Import `commentBus`; thêm controller `streamComments`; sau khi `commentPost` lưu DB → `commentBus.emit(id, 'comment:new', { postId, comment, comments })`. |
| `server/routes/posts.js` | Thêm `GET /:id/comments/stream`. Đặt **trước** `GET /:id` cho rõ ràng (Express phân tách theo segment nên không xung đột thực sự, nhưng vị trí này dễ đọc hơn). |
| `client/src/api/commentStream.js` *(mới)* | `openCommentStream(postId, { onReady, onNewComment, onError })` → trả về hàm đóng. |
| `client/src/components/PostDetails/commentsection.jsx` | Thêm `useEffect` mở stream theo `post._id`, đóng khi unmount. Khi nhận `comment:new` → `setComments(serverComments)`. |
| `docs/ngay2.md` *(mới)* | Tài liệu này. |

## Hành vi end-to-end

### A. Người dùng cùng đang xem một post

1. User X mở `/posts/abc` → component `CommentSection` mount → `useEffect` gọi `openCommentStream('abc', ...)` → server `subscribe('abc', resX)`.
2. User Y mở cùng URL → `subscribe('abc', resY)`.
3. User Y gõ comment, bấm Post → REST `POST /posts/abc/commentPost` → controller lưu DB → `commentBus.emit('abc', 'comment:new', { ..., comments })` → cả `resX` và `resY` đều nhận.
4. Client X: `onNewComment` → `setComments(serverComments)` → DOM cập nhật ngay.
5. Client Y: vẫn dispatch `commentPost` thunk → Redux cập nhật → `useEffect([post])` cũ chạy → `setComments(post.comments)`. Sau đó SSE event tới → `setComments(serverComments)`. Hai lần set cùng dữ liệu, không nháy thấy được.

### B. Ngắt kết nối / reconnect

- Trình duyệt tự reconnect `EventSource` sau ~3s khi server đứt.
- Khi reconnect, server gửi lại event `ready` (postId), nhưng **không replay event cũ**. Nếu trong lúc đứt có comment mới, client chỉ thấy khi:
  - bài được fetch lại qua `getPost` (đổi route hoặc F5), HOẶC
  - có comment **mới** sau khi reconnect (event tiếp theo).
- Đánh đổi chấp nhận được cho Phạm vi S. Nếu cần "không bỏ sót", trong Phạm vi M (DM) sẽ dùng "last event id" hoặc REST polling fallback.

### C. Heartbeat

- Mỗi 25s server ghi `: ping\n\n` (SSE comment) — không trigger event nào ở client, chỉ giữ kết nối qua proxy/nginx hay đóng idle ~30s.

### D. Dọn dẹp

- `req.on('close')` và `req.on('aborted')`: server xóa `res` khỏi room, clear `setInterval` heartbeat.
- React unmount `CommentSection` → hàm trả về từ `openCommentStream` đóng `EventSource` → trình duyệt gửi `close` → server cleanup.

## Gotcha — CRA dev proxy buffer SSE

**Triệu chứng:** Sign in 2 tài khoản, A comment → B không thấy realtime, phải reload mới thấy. Server log có HIT POST + 2 stream subscribers.

**Nguyên nhân:** `http-proxy-middleware` mặc định của CRA (qua field `"proxy"` trong `package.json`) buffer toàn bộ response body, kể cả khi `Content-Type: text/event-stream`. Browser EventSource không nhận event cho tới khi proxy đóng connection (vô hạn).

**Cách fix (đã áp dụng):** Trong `client/src/api/commentStream.js`, ở dev (port 3000) EventSource trỏ **thẳng** `http://<hostname>:5000`, bỏ qua CRA proxy. `cors()` server cho phép mọi origin nên hợp lệ. Code:

```js
function resolveApiBase() {
  if (process.env.REACT_APP_API_URL) return process.env.REACT_APP_API_URL;
  if (typeof window !== 'undefined' && window.location.port === '3000') {
    return `${window.location.protocol}//${window.location.hostname}:5000`;
  }
  return '';
}
```

**Alternative đã cân nhắc và bỏ:**
- `setupProxy.js` với http-proxy-middleware tự config — vẫn không tránh được layer `compress` của webpack-dev-server.
- `res.flush()` ở server — không có middleware compression nên không có gì để flush; vô tác dụng.

**Trong production:** không có bug này — phía sau nginx/Cloudflare/PaaS đã có header `X-Accel-Buffering: no` (mình đã set) + không có CRA proxy.

## Edge case / hạn chế đã biết

1. **Bài bị xóa khi đang stream** — client vẫn nhận `ready` rồi nằm im, không có event nào nữa. Có thể bổ sung event `post:deleted` sau.
2. **Comment bị xóa** — chưa có endpoint xóa comment trong server hiện tại, nên không cần broadcast event này.
3. **Edit comment** — tương tự, chưa có ở server hiện tại.
4. **Scale nhiều process** — nếu bật cluster, mỗi process có `rooms` riêng → user kết nối vào process A không nhận event do user khác gọi POST trên process B. Khi cần scale: chuyển `commentBus` thành Redis Pub/Sub (giữ nguyên signature `subscribe/emit`).
5. **Auth trên stream** — đang public; vẫn an toàn vì payload chỉ là dữ liệu mà REST `GET /posts/:id` cũng đã trả. Khi có "bài private" sẽ phải verify JWT lúc subscribe.
6. **Comment do chính mình gửi vẫn replay qua SSE** — đã phân tích ở mục A.5: idempotent, không gây nháy.
7. **Browser limit ~6 EventSource cùng origin** — chỉ đáng lo nếu user mở nhiều tab. Vì stream gắn theo post, mở nhiều tab cùng post tốn nhiều socket → chấp nhận được ở quy mô hiện tại.

## Kiểm tra thủ công đề xuất

1. Mở 2 trình duyệt (hoặc 1 ẩn danh) cùng vào `/posts/<id>`.
2. Đăng nhập 1 bên, gửi comment.
3. Bên còn lại phải thấy comment **xuất hiện trong < 1s, không refresh**.
4. DevTools → Network → filter `EventSource` → kiểm tra status `200`, "EventStream" tab có thấy event `ready`, sau đó `comment:new` khi gửi.
5. Tắt server, đợi vài giây → trình duyệt reconnect (xuất hiện request lặp lại). Bật server lại → kết nối phục hồi.

## Tham chiếu mã (điểm neo)

- Bus: `server/realtime/commentBus.js`.
- Controller: `server/controllers/posts.js` — `streamComments` (~dòng 130 trở đi), `commentPost` thêm `commentBus.emit` ngay trước `res.json`.
- Route: `server/routes/posts.js` — dòng `router.get('/:id/comments/stream', streamComments)`.
- Client util: `client/src/api/commentStream.js`.
- UI: `client/src/components/PostDetails/commentsection.jsx` — `useEffect` thứ hai (subscribe theo `post?._id`).

## Mở rộng đề xuất (sau này)

- ✅ **Live like count** — đã làm tiếp ngay trong ngày, xem phần [A1](#a1--live-like-count-mở-rộng-cùng-ngày) bên dưới.
- **Typing indicator**: cần kênh client → server (POST `/posts/:id/typing`) hoặc bắt đầu cân nhắc Socket.IO.
- **Notifications cho người tạo bài**: emit event riêng kênh `user:{creatorId}` khi bài có like/comment — chuẩn bị cho bell icon.
- **Reconnect không bỏ sót**: dùng `Last-Event-ID` SSE header + lưu một buffer event gần nhất theo post.
- **Chuyển Phạm vi M (DM 1-1)**: bắt đầu khi đã có B1 (trang hồ sơ).

## Khi schema comment đổi (lưu ý forward-compatible)

Roadmap (`MO_RONG_DU_AN.md` mục 3) có kế hoạch refactor `comments: [String]` → object `{ userId, name, text, createdAt }`. Khi đổi:

1. `PostMessage.comments` đổi thành mảng object trong model.
2. `commentBus.emit('comment:new', { postId, comment, comments })` — `comments` tự đổi cấu trúc theo Mongoose. Client `setComments(serverComments)` vẫn replace nguyên cụm — **không phải sửa**.
3. `commentsection.jsx` `splitCommentAuthorBody` không còn cần — đọc `c.name` / `c.text` thẳng từ object.

→ **Lý do thiết kế payload truyền nguyên `comments`** (thay vì chỉ truyền `comment` lẻ) chính là để tương lai schema đổi không phá hợp đồng SSE. Người sửa schema không cần đụng tới `commentBus` hay client stream.

## Mức độ "đầy đủ"

- **Đủ cho handoff:** mục tiêu, quyết định kỹ thuật, kiến trúc, hợp đồng event, hành vi, edge case, hướng kiểm tra, điểm neo mã.
- **Artifact:** file này (`docs/ngay2.md`) + một module mới `server/realtime/commentBus.js` + 1 file client mới `client/src/api/commentStream.js`. Các file khác chỉ sửa nhỏ, không ảnh hưởng tính năng hiện có.

---

# A1 — Live like count (mở rộng cùng ngày)

> Tiếp tục ngay trong ngày 14/05/2026, dựng trực tiếp trên hạ tầng SSE phía trên. Không thêm dependency, không thêm route, không đổi tên gì cả.

## Mục tiêu A1

Khi A bấm tim một bài, **số like trên trang B** (đang mở chi tiết cùng bài) đổi tức thì, không cần reload. Đây là bước nhỏ kiểm chứng rằng `commentBus` hiện tại đủ tổng quát để gánh nhiều loại event, không cần lớp abstraction mới.

## Quyết định kỹ thuật A1

| Tiêu chí | Lựa chọn | Lý do |
|----------|----------|-------|
| Kênh phát | **Tái sử dụng** `commentBus` + endpoint `/posts/:id/comments/stream` hiện có | 1 EventSource cho 1 post; SSE phân biệt loại bằng `event:` field. Tránh mở thêm route/connection. |
| Payload `like:update` | **Partial** `{ postId, likes }` | Không gửi cả post (có thể chứa base64 ảnh vài MB). Client merge vào state đang có. |
| Áp dụng UI | **Chỉ `PostDetails`** | Subscribe theo `postId`. Home grid (≤9 post) cố ý không subscribe → tránh 9 EventSource song song. Người bấm vẫn thấy ngay vì có optimistic update từ REST. |
| Reducer | **Merge** thay vì replace (`case LIKE`) | Một action `LIKE` xử lý cả 2 dạng payload: full post (REST) và partial `{ _id, likes }` (SSE). Spread giữ nguyên các field khác (selectedFile, comments…). |
| Auth stream | **Vẫn không yêu cầu** | Giữ nhất quán với phần trên; trang chi tiết public. POST `/likePost` vẫn cần JWT (server kiểm `req.userId`). |
| Đặt tên | **Không** đổi `commentBus` → `realtimeBus` ở bước này | Bus đang là per-post, hợp với cả comment lẫn like. Khi nào lên A2 (Bell — kênh per-user) mới cân nhắc tách. Tránh churn vô ích. |

## Kiến trúc A1 (delta so với phần trên)

```
   ┌──────────────────────────────┐
   │ POST /posts/:id/likePost     │
   │  ├─ toggle likes             │
   │  ├─ save                     │
   │  ├─ commentBus.emit(         │
   │  │     id, 'like:update',    │
   │  │     { postId, likes })    │
   │  └─ res.json(updatedPost)    │
   └──────────────────────────────┘
                  │ event: like:update
                  ▼
   ┌──────────────────────────────┐
   │ CommentSection (SSE handler) │
   │  onLikeUpdate ─► dispatch    │
   │    { LIKE, { _id, likes } }  │
   └──────────────────────────────┘
                  │
                  ▼
   ┌──────────────────────────────┐
   │ reducer LIKE  (merge)        │
   │  state.post = {...post, ...} │
   │  posts[i]   = {...p, ...upd} │
   └──────────────────────────────┘
                  │
                  ▼
       LikeSection re-render
       số like nhảy ngay
```

## SSE contract (mở rộng từ bảng trên)

| Event | Khi nào | Payload |
|-------|---------|---------|
| `ready` *(đã có)* | Ngay sau khi client kết nối | `{ postId }` |
| (heartbeat) *(đã có)* | Mỗi 25s | `: ping` |
| `comment:new` *(đã có)* | Sau khi `commentPost` lưu | `{ postId, comment, comments[] }` |
| **`like:update`** *(mới)* | Sau khi `likePost` toggle xong | `{ postId, likes[] }` |

Khoá phát vẫn là `String(postId)` — chỉ client đang xem đúng bài đó nhận được.

## File chạm thêm

| File | Thay đổi |
|------|----------|
| `server/controllers/posts.js` | `likePost` thêm `commentBus.emit(id, 'like:update', { postId, likes })` ngay trước `res.json(updatedPost)`. |
| `client/src/api/commentStream.js` | Thêm listener `like:update` → gọi `handlers.onLikeUpdate(data)`. JSDoc kèm `onLikeUpdate?: (data) => void`. |
| `client/src/components/PostDetails/commentsection.jsx` | Import action type `LIKE`; truyền thêm `onLikeUpdate` vào `openCommentStream` → `dispatch({ type: LIKE, payload: { _id, likes } })`. |
| `client/src/reducers/posts.js` | `case LIKE` đổi từ replace sang **merge** (spread) cho cả `posts`, `relatedPosts`, `state.post`. |

Không động vào:

- `LikeSection.jsx` — render `post.likes.length` từ Redux store; reducer merge xong là tự re-render.
- `actions/posts.js` `likePost` thunk — vẫn dispatch `LIKE` với full post từ REST; merge reducer nhận full payload không khác replace (spread overwrite tất cả keys).

## Hành vi end-to-end A1

1. Browser A và B đều đang ở `PostDetails` của post X. Cả hai có entry trong `rooms.get(X)`.
2. A bấm tim:
   - Client A: thunk `likePost` → REST trả full post → dispatch `LIKE` với full payload → UI update.
   - Server: lưu DB → `commentBus.emit(X, 'like:update', { postId, likes })`.
   - Cả A và B đều nhận event `like:update` từ kênh chung.
3. Trên B: `onLikeUpdate` dispatch `{ LIKE, { _id, likes } }` → reducer merge `state.post.likes` → `LikeSection` re-render với số mới.
4. Trên A: cùng event cũng tới — merge với `likes` giống hệt → no-op trực quan (giá trị không đổi).

## Edge case A1

- **Tự dội về A**: A nhận lại event của chính mình → dispatch dư 1 lần với cùng `likes`. Không xấu, có thể tối ưu sau (gửi `actorId` để skip self-broadcast) khi cần.
- **Spam like nhanh**: payload nhỏ, mỗi event là **snapshot** `likes` (không phải delta) — luôn tự khôi phục đúng trạng thái cuối.
- **Home page** cố ý không live: tránh mỗi card 1 EventSource. Nếu muốn live trên Home → cần 1 channel broadcast chung, server lọc theo các post hiện đang ở `currentPage`.
- **Race REST vs SSE**: nếu REST trả sau SSE event, dispatch sau thắng. Cả hai đều có `likes` cùng nguồn DB → kết quả cuối khớp.
- **Reload tay**: `FETCH_POST` ghi đè `state.post` bằng snapshot DB → số like đúng. Không xung đột với SSE.

## Lý do reducer phải **merge**

Trước A1, `case LIKE` **replace** cả entry vì REST luôn trả full post. Sau A1, SSE gửi `{ _id, likes }` — replace sẽ làm `state.post` chỉ còn 2 key, mất `selectedFile`/`comments`/v.v. → trang chi tiết bị "rỗng" ngay lập tức. Spread merge xử lý cả 2 dạng payload:

```js
case LIKE: {
    const upd = action.payload;
    const merge = (p) =>
        String(p._id) === String(upd._id) ? { ...p, ...upd } : p;
    return {
        ...state,
        posts: state.posts.map(merge),
        relatedPosts: (state.relatedPosts || []).map(merge),
        post:
            state.post && String(state.post._id) === String(upd._id)
                ? { ...state.post, ...upd }
                : state.post,
    };
}
```

Spread của full post = overwrite tất cả keys (giống replace cũ); spread của partial = chỉ overwrite key được gửi.

## Kiểm thử thủ công A1

1. `cd server && npm run dev` (cần nodemon để reload — bài học CRA proxy/server stale từ phần trên đã ghi nhận).
2. `cd client && npm start`.
3. Mở 2 trình duyệt (hoặc 1 trình duyệt + 1 cửa sổ ẩn danh), đăng nhập 2 tài khoản khác nhau.
4. Cả hai vào cùng `/posts/<id>`.
5. **Like**: A bấm tim → B số like đổi tức thì (không reload).
6. **Unlike**: A bấm lại → B trừ ngay 1.
7. **Mix**: A like, B like, A unlike → cả hai phải khớp số.
8. **Regression**: gõ comment ở A → B vẫn nhận `comment:new`. Không có event nào bị "tranh đoạt".

DevTools console B (mở **trước** khi vào trang) nên có:

```
[SSE] open http://localhost:5000/posts/<id>/comments/stream
[SSE] ready {"postId":"<id>"}
... khi A bấm:
[SSE] like:update {"postId":"<id>","likes":[...]}
```

(Các log SSE đã gỡ trong bản chạy thật; bật lại bằng `console.log` tạm trong `openCommentStream` khi cần.)

## Tham chiếu mã A1

- Server emit: `server/controllers/posts.js` — block `likePost`, ngay trước `res.json(updatedPost)`.
- Client listener: `client/src/api/commentStream.js` — `es.addEventListener('like:update', ...)`.
- Subscribe UI: `client/src/components/PostDetails/commentsection.jsx` — `useEffect([post?._id, dispatch])`.
- Reducer merge: `client/src/reducers/posts.js` — `case LIKE`.

## Mở rộng tiếp (sắp xếp ưu tiên)

| Mức | Việc | Khi nào |
|-----|------|---------|
| Nhanh | Skip tự dội về actor: payload thêm `actorId`, client so với `user.result?._id`, trùng thì bỏ. | Khi spam like trở thành vấn đề perf. |
| Nhanh | Thêm `comment:delete` cùng cơ chế khi triển khai xoá comment. | Sau khi có endpoint xoá comment. |
| Vừa | Đổi tên `commentBus` → `realtimeBus`, route `/comments/stream` → `/stream`. | Khi lên A2 (Bell — kênh per-user). Trước đó tránh churn. |
| Vừa | Live like trên Home grid bằng 1 broadcast chung, server lọc theo `currentPage`. | Khi muốn Home "sống" hơn — cần đo: chấp nhận 9+ EventSource hay không. |
| Lớn | Tách `commentBus` → Redis Pub/Sub. | Khi scale ≥ 2 instance Express. |

Xem bức tranh chung tại `MO_RONG_DU_AN.md` mục 4 (Realtime / Streaming) và `Y_TUONG_TINH_NANG.md`.

---

# Phân quyền P0 — Khoá lỗ hổng edit/delete bất kỳ ai

> Tiếp tục trong ngày 14/05/2026, làm xen giữa A1 và A2. Lý do ưu tiên: 2 endpoint cho phép **bất kỳ user đã login** đều có thể `PATCH`/`DELETE` post của người khác — critical, phải fix trước khi đắp thêm tính năng mới.

## Lỗ hổng đã đóng

| # | Endpoint | Trước | Sau |
|---|----------|-------|-----|
| 1 | `PATCH /posts/:id` | Bất kỳ token nào cũng update được | **403** nếu không phải `post.creator`. Body cũng không cho phép ghi đè `creator` / `_id`. |
| 2 | `DELETE /posts/:id` | Bất kỳ token nào cũng xoá được | **403** nếu không phải owner. |
| 3 | `PATCH /posts/:id/likePost` | `post` không tồn tại → crash 500 (`post.likes.findIndex` trên `null`) | **404** khi post không tồn tại. |
| 4 | `POST /posts/:id/commentPost` | Tương tự #3 | **404** khi post không tồn tại. |
| 5 | `auth` middleware | Token sai/thiếu → **500** "Unauthorized" (gây hiểu nhầm khi debug) | **401** kèm `code: 'NO_TOKEN' \| 'BAD_TOKEN'`. |
| 6 | `likePost` / `commentPost` khi không có `req.userId` | Trả `res.json(...)` (200 OK) với message "Unauthenticated" — client tưởng thành công | **401** chuẩn. |

## Quyết định kỹ thuật

| Quyết định | Lựa chọn | Lý do |
|------------|----------|-------|
| Status code | **401** (thiếu/sai token) vs **403** (đã auth nhưng không có quyền) vs **404** (resource không tồn tại / id sai format) | Theo RFC 9110. Phân biệt rõ giúp client xử lý đúng (401 → đăng nhập lại; 403 → báo "không phải bài của bạn"; 404 → đã bị xoá). |
| Trật tự check trong handler | `id format → load post → 404 nếu null → 403 nếu khác owner` | "Fail-fast" + cho phép phân biệt "không tồn tại" và "không có quyền". Có ý kiến cho rằng nên trả 404 thay vì 403 để tránh leak existence — không áp dụng ở đây vì post là public-visible (đã thấy ở Home), không cần che. |
| Sanitize body của `updatePost` | Xoá `creator` và `_id` khỏi `req.body` trước khi update | Chống leo quyền: dù client gửi `creator` trong body cũng không thay đổi được. |
| Helper `loadPostAsOwner(req, res)` | Tách thành hàm dùng chung cho `updatePost` + `deletePost` | Tránh lặp; mọi controller cần ownership đều dùng cùng 1 logic. |
| Defensive double-check trong `likePost`/`commentPost` | Vẫn check `req.userId` dù middleware `auth` đã chặn | Trường hợp ai đó vô tình bỏ middleware trên route — defense in depth. Cost ~1 dòng. |
| `auth` middleware xử lý header | Hỗ trợ cả `Bearer <token>` lẫn `<scheme> <token>` (split bằng space) | `Bearer` là RFC chuẩn; cách cũ `split(" ")[1]` vẫn hoạt động. |
| Error code (`NO_TOKEN`, `BAD_TOKEN`) | Có | Client dễ phân biệt: `NO_TOKEN` = chưa login, redirect signin; `BAD_TOKEN` = token hỏng/hết hạn, xoá localStorage rồi yêu cầu login lại. Là metadata thêm, không bắt buộc client dùng. |

## File chạm

| File | Thay đổi |
|------|----------|
| `server/middleware/auth.js` | 500 → 401; thêm `code: 'NO_TOKEN' \| 'BAD_TOKEN'`; hỗ trợ `Bearer` prefix; check `req.userId` không null sau khi decode (Google OAuth `sub` có thể missing). |
| `server/controllers/posts.js` | Thêm helper `loadPostAsOwner`; `updatePost` / `deletePost` dùng helper + 403; `updatePost` sanitize body (loại `creator` & `_id`); `likePost` / `commentPost` trả 401 đúng chuẩn + check post tồn tại → 404. |

Client **không sửa** ở pass này — nút Edit/Delete ở `Posts/Post/post.js` đã ẩn cho người không phải owner (defense in UX), nay được hậu thuẫn thêm bởi server check. UI ở `PostDetails/` không có nút Edit/Delete nên không cần làm thêm.

## Kiểm thử thủ công

Yêu cầu: 2 tài khoản A, B; A đã tạo 1 bài.

1. **B sửa bài của A** (DevTools → Network → Postman / curl):
   ```bash
   curl -X PATCH http://localhost:5000/posts/<A_post_id> \
     -H "Authorization: Bearer <B_token>" \
     -H "Content-Type: application/json" \
     -d '{"title":"hacked"}'
   ```
   Kỳ vọng: **403** `{ "message": "Only the post owner can do that" }`.
2. **B xoá bài của A**: tương tự `DELETE` → **403**.
3. **B sửa bài của chính B** → **200** + dữ liệu mới.
4. **Không token**: `curl -X PATCH http://localhost:5000/posts/<id>` → **401** `{ message, code: "NO_TOKEN" }`.
5. **Token bậy**: header `Authorization: Bearer banana` → **401** `{ code: "BAD_TOKEN" }`.
6. **Post đã xoá rồi vẫn like**:
   - A xoá post.
   - B (chưa reload) bấm tim → server **404** `{ message: "Post not found" }`. Trước đây sẽ 500.
7. **Body cố ghi đè creator**:
   ```bash
   curl -X PATCH http://localhost:5000/posts/<my_post> \
     -H "Authorization: Bearer <my_token>" -H "Content-Type: application/json" \
     -d '{"title":"x","creator":"<another_user_id>"}'
   ```
   Kỳ vọng: 200, post update, **nhưng `creator` không đổi**. Verify bằng `GET /posts/<id>`.
8. **Regression**: realtime comment + live like vẫn chạy đúng (không phá A1).

## Edge case / hạn chế còn lại

- **JWT secret vẫn hardcoded** (`'test'`) — pass riêng. Đây là rủi ro nghiêm trọng cho production, nhưng tách ra vì cần thêm `.env` + cập nhật quy trình deploy.
- **Google OAuth token chỉ `jwt.decode`**, không verify chữ ký — vẫn như hiện trạng. Khi muốn an toàn cần `google-auth-library`. Hoãn.
- **`creator: String` trong schema** — vẫn lưu raw id (Mongo `_id` cho local, Google `sub` cho OAuth). Không bị bug nhưng so sánh phải `String()` cả hai vế.
- **Validation input** (length, format, XSS trong title/message/comment): chưa làm; pass riêng với `express-validator`/Zod.
- **Rate limiting** chưa làm; pass riêng.

## Tham chiếu mã

- `server/middleware/auth.js` — toàn bộ file (gọn).
- `server/controllers/posts.js` — `loadPostAsOwner` (~dòng 64), `updatePost` / `deletePost` ngắn lại nhờ helper, `likePost` / `commentPost` thêm 401 + 404.

---

# Tối ưu like — fast feedback (cùng ngày)

> Sau khi phân quyền xong, user phản hồi click like "chậm hiển thị". Truy luồng → 3 nguyên nhân, fix luôn cả 3 vì mỗi cái rất nhỏ.

## Nguyên nhân chậm (cùng tồn tại từ codebase gốc)

| # | Vấn đề | Tác động đo được |
|---|--------|------------------|
| 1 | **Không có optimistic update** | UI đợi roundtrip ~100–500ms mới thấy số mới. Cảm giác "click rồi mới đổi". |
| 2 | **Server trả `res.json(updatedPost)` đầy đủ** (gồm `selectedFile` base64) | Response 1–5 MB khi post có ảnh lớn. JSON parse ở client cũng tốn. |
| 3 | **`findById` rồi `findByIdAndUpdate(id, post, …)` ghi đè full document** | DB write toàn bộ document mỗi click, không phải atomic operator. |

Cả 3 đều là code mặc định của tutorial gốc, không phải regression của các pass realtime/phân quyền vừa làm.

## Quyết định

| Quyết định | Lựa chọn | Lý do |
|------------|----------|-------|
| Optimistic update | **Toggle ngay tại client** trước khi gọi API | Cảm giác instant. Đây là phần "thấy được" nhiều nhất. |
| Rollback khi fail | **Có** — dispatch lại `likes` cũ + toast | Tránh UI lệch DB nếu server 401/404/500. |
| Server payload | **Slim** `{ _id, likes }` | Cắt 99% băng thông khi post có ảnh. Reducer `LIKE` đã merge từ A1, không phá field khác. |
| DB pattern | **Atomic** `$addToSet` / `$pull` + projection `{ likes: 1 }` | 2 query nhỏ thay vì load-modify-save full document. Không động tới `selectedFile` ở DB. |
| Còn `findById` đọc trước | **Vẫn cần** | Để biết hướng toggle (add/remove). Có projection nên chỉ tốn ~vài byte. |
| Lấy `userId` ở client | **Tách util `utils/authUser.js`** | Trước đây `Post.js` có copy riêng, giờ action mới cũng cần — gom lại tránh lặch. |

## File chạm

| File | Thay đổi |
|------|----------|
| `server/controllers/posts.js` `likePost` | `findById` chỉ projection `likes`; toggle bằng `$addToSet`/`$pull`; trả `{ _id, likes }`. SSE emit giữ nguyên. |
| `client/src/actions/posts.js` `likePost` thunk | Lấy `userId` từ localStorage; snapshot `likes` từ `getState` (tìm post ở `posts`/`relatedPosts`/`post`); dispatch optimistic; await API; reconcile / rollback. |
| `client/src/utils/authUser.js` *(mới)* | `readStoredProfile()`, `getUserId(user)`. |
| `client/src/components/Posts/Post/post.js` | Bỏ 2 hàm local trùng (~14 dòng), import từ `utils/authUser`. |

## Luồng mới so với cũ

```
TRƯỚC                                    SAU
─────                                    ───
click ❤                                  click ❤
  └─ await API …………… 100–500ms          ├─ dispatch LIKE (optimistic) ── UI nhảy NGAY
       ├─ load full post (DB)            └─ await API ………… 30–80ms (slim)
       ├─ rewrite full post (DB)              ├─ findById projection likes (DB)
       └─ res.json(updatedPost) 1–5MB         ├─ $addToSet/$pull (DB)
  └─ dispatch LIKE (full)                     └─ res.json {_id,likes} ~100 byte
  └─ UI cập nhật                         └─ dispatch LIKE (reconcile, no-op visible)
```

Trên trang `PostDetails`, vẫn có thêm 1 dispatch nữa từ SSE `like:update` (self-broadcast) — không thấy được vì cùng `likes`. Khi nào đụng đến A2 sẽ skip self-broadcast bằng `actorId`.

## Edge case

- **Click nhanh liên tục (spam like)**: optimistic dispatch chạy đồng bộ → state luôn nhất quán cục bộ. Mỗi click vẫn gọi 1 API → server có thể nhận theo thứ tự ngược → trạng thái cuối vẫn đúng vì `$addToSet`/`$pull` idempotent. Nếu mạng đảo thứ tự response, reconcile có thể "nhảy" 1 nhịp trước khi ổn — chấp nhận được.
- **Không có user** (chưa login): action trả luôn, toast "Please sign in to like." Trước đây nút đã bị `disabled` ở UI nên không tới đây.
- **Post bị xoá rồi vẫn click**: server 404 → rollback `likes` về cũ + toast. UI không bị mất gì.
- **Optimistic sai do snapshot rỗng**: nếu `getState` không có post trong cả `posts`/`relatedPosts`/`post` (hiếm — Post.js render từ Redux), `oldLikes = []` → optimistic add userId. Server sẽ trả về `likes` đúng → reconcile sửa lại. Không crash.

## Đo nhanh (đề xuất)

DevTools → Network → click ❤:

| Chỉ số | Trước | Sau (kỳ vọng) |
|--------|-------|---------------|
| Response size | 1–5 MB (tuỳ ảnh) | ~80–200 byte |
| Time to UI update | bằng roundtrip API | ~1 frame (16ms) |
| DB write payload | full document | chỉ field `likes` |

---

# Tối ưu load posts (cùng ngày)

> Tiếp tục cùng phiên: user phản hồi "các post load cũng khá chậm". Truy controllers → tìm thấy 1 bug nặng + vài thiếu sót dễ fix.

## Bug nặng đã đóng

```diff
 export const getposts = async (req, res, next) => {
     const { page } = req.query;
     try {
         const LIMIT = 9;
         const startIndex = (Number(page) - 1) * LIMIT;
         const total = await PostMessage.countDocuments({});
-        const posts = await PostMessage.find().sort({ _id: -1 }).limit(LIMIT).skip(startIndex);
-        const postMessage = await PostMessage.find();   // ← BUG
+        const [total, posts] = await Promise.all([
+            PostMessage.countDocuments({}),
+            PostMessage.find().sort({ _id: -1 }).limit(LIMIT).skip(startIndex).lean(),
+        ]);
         res.status(200).json({...});
     } catch ...
 };
```

Dòng `const postMessage = await PostMessage.find();` fetch **toàn bộ** collection (bao gồm cả `selectedFile` base64) rồi vứt vào biến không dùng. Nếu DB có 100 post × 2 MB ảnh → **~200 MB IO + memory** vô ích mỗi lần load Home. Đây là sửa quan trọng nhất trong pass này.

## Các tối ưu kèm theo

| Thay đổi | File | Lợi ích |
|----------|------|---------|
| `Promise.all([count, find])` thay vì 2 `await` tuần tự | `getposts` | Latency ≈ max(count, find) thay vì cộng dồn. |
| `.lean()` cho mọi list query | `getposts`, `getPostsBySearch`, `getPost` | Bỏ Mongoose hydration → JS object thuần. Tiết kiệm ~30% CPU + bộ nhớ phía Node. |
| `.limit(20)` + `.sort({_id: -1})` cho `getPostsBySearch` | `getPostsBySearch` | Khi DB lớn, search có thể kéo hàng trăm/ngàn bài. UI cũng chỉ hiển thị vài bài. |
| Defensive `tags` undefined / `searchQuery === 'none'` | `getPostsBySearch` | Trước đây `tags.split(',')` crash 500 nếu `tags` null. Giờ guard kỹ + filter động (chỉ apply tiêu chí thực sự có). |
| Trả `{ data: [] }` sớm khi không có search/tag | `getPostsBySearch` | Tránh scan full collection cho query rỗng. |
| `compression` middleware (gzip) | `server/index.js` | Response JSON nén ~30–50% (mạnh nhất cho metadata + tags + comments lặp; base64 ảnh giảm ít — đã là binary nén sẵn). |
| Loại SSE khỏi compression (theo URL) | `server/index.js` | Quan trọng: nếu nén SSE, middleware buffer chunks → mất realtime. Match theo `req.path.endsWith('/comments/stream')`. |
| Validate `ObjectId.isValid` ở `getPost` + check null | `getPost` | Trước đây id sai format → 404 với message rối; post bị xoá → trả `null` 200. Giờ luôn 404 rõ ràng. |

## Quyết định cố ý KHÔNG làm

| Việc | Lý do hoãn |
|------|------------|
| Projection bỏ `selectedFile` ở list endpoint | UI **đang dùng ảnh** để render grid + related preview. Bỏ là vỡ UI. |
| Projection bỏ `comments` array ở list | Hiện grid không hiển thị, có thể trim. Nhưng `comments` thường nhỏ so với ảnh — lợi ích biên. Để khi nào schema comment đổi sang object thì xử lý cùng. |
| Tách ảnh khỏi document (file storage S3/Cloudinary) | Đây là fix dài hạn đúng nhất — base64 nhúng DB là root cause. Cần refactor model + migrate dữ liệu + upload flow → task lớn. Ghi nhận ở `MO_RONG_DU_AN.md` mục 2. |
| Cursor pagination thay skip/limit | `skip()` chậm khi `page` lớn. Hiện DB còn nhỏ nên chưa cần. Sẽ phải đổi khi vượt vài nghìn post. |
| Cache (Redis / in-memory) cho `getposts` page 1 | Premature; chưa đo profile thấy là bottleneck. |

## File chạm

| File | Thay đổi |
|------|----------|
| `server/controllers/posts.js` | Xoá dead `find()`; `Promise.all` count + find; `.lean()` toàn bộ list query; `getPostsBySearch` thêm limit + sort + defensive filter; `getPost` thêm ObjectId validate + null check. |
| `server/index.js` | Import `compression`; áp middleware **trước** `express.json`; filter loại trừ SSE route. |
| `server/package.json` | Thêm dependency `compression`. |

## Đo nhanh (đề xuất)

DevTools → Network → load Home page `/`:

| Chỉ số | Trước (DB ~100 post, ảnh ~2 MB) | Sau (kỳ vọng) |
|--------|-------------------------------|---------------|
| DB IO mỗi request | ~200 MB (do dead `find()`) + ~18 MB (9 posts grid) | ~18 MB (chỉ 9 posts grid) |
| Response size (uncompressed) | ~18 MB | ~18 MB (vẫn 9 posts với ảnh) |
| Response size (gzip) | n/a | ~12–15 MB (giảm 20–30% vì base64 đã nén kém) |
| Latency total (LAN) | 1–3 s | 200–500 ms |

Tỉ lệ cải thiện sẽ **rất lớn** khi DB có nhiều post. Khi DB ít (vài post), khác biệt khó cảm nhận bằng mắt thường.

## Kiểm thử thủ công

1. **Restart server** (nodemon tự reload nếu dùng `npm run dev`; nếu chạy `node index.js` thì kill + restart).
2. Mở Home → Network tab → tìm request `GET /posts?page=1`.
   - Status 200.
   - Response header có `content-encoding: gzip`.
   - **Time** giảm rõ rệt nếu DB nhiều post.
3. Mở PostDetails của 1 bài có tags → Network → request `GET /posts/search?searchQuery=none&tags=...`.
   - Response **giới hạn 20 bài** (không còn hàng ngàn).
   - "You might also like" vẫn hiển thị bình thường.
4. **Regression realtime**: bình luận + like vẫn realtime → SSE không bị compression chặn (kiểm tra Network tab: request `/comments/stream` **không** có `content-encoding`).
5. **Defensive**: gọi `GET /posts/search?searchQuery=&tags=` → trả `{ data: [] }`, không crash.

## Vấn đề còn lại (cho task riêng)

- **Ảnh base64 nhúng MongoDB** vẫn là gánh nặng chính. Mỗi post ~vài trăm KB đến vài MB. Cần file storage thật sự — xem `MO_RONG_DU_AN.md` mục 2 "Backend & chất lượng dữ liệu".
- **`skip` pagination** chậm dần với page lớn. Cursor-based pagination (`_id < lastSeen`) khi DB >5k posts.
- **`countDocuments`** trên collection lớn cần `estimatedDocumentCount()` (nhanh hơn nhưng không chính xác 100%) hoặc cache count.

---

# A2 — Bell notifications (đề xuất, chưa triển khai)

> Đã chốt kế hoạch, hoãn lại để ưu tiên **phân quyền** trước (mục 1 `MO_RONG_DU_AN.md`). Quay lại A2 sau.

## Tóm tắt

Khi bài của user X được like (chỉ khi add, không phải unlike) hoặc comment **bởi người khác**, X nhận noti realtime: chuông trên navbar + badge unread + dropdown 10 noti gần nhất. Click → điều hướng tới `/posts/<id>`.

## Quyết định đã chốt

| Câu hỏi | Lựa chọn | Ghi chú |
|---------|----------|---------|
| Persistence | **Live-only** | Reload trang = bell rỗng. Khi cần lịch sử sẽ làm A3: model `Notification` + REST `GET /notifications`. |
| Sự kiện | **`like` (add only) + `comment`** | Bỏ qua unlike vì "X bỏ like bài bạn" không giá trị. |
| Self-action | **Skip** (`actorId === creatorId`) | Server-side filter, đỡ tốn băng thông. |
| Token gửi sao | **Query `?token=<jwt>`** | `EventSource` không set header được. |
| Mount SSE | **`Navbar`** | Sống cùng vòng đời app, không gắn theo route. |
| Đổi tên bus | **Có**: `commentBus` → `realtimeBus` | Lúc này có 2 scope (`post:<id>` và `user:<id>`) nên tên cũ không còn hợp. |

## Các bước (mỗi bước ~20–30 phút)

1. **Tổng quát hoá bus** *(server, refactor không đổi hành vi)*
   - `commentBus.js` → `realtimeBus.js`; `rooms: Map<scopeKey, Set<res>>`.
   - Cập nhật caller hiện tại dùng prefix `post:<id>`.
   - Test regression realtime comment + like.

2. **Auth middleware cho stream** *(server)*
   - Helper `authFromQuery`: đọc `req.query.token` → verify JWT → set `req.userId` + `req.userName`. Fail 401.
   - Không áp lên `/:id/comments/stream` cũ.

3. **Endpoint notification stream** *(server)*
   - `GET /notifications/stream` với `authFromQuery` → subscribe `user:<userId>`.

4. **Emit `notif:new` từ controllers** *(server)*
   - `commentPost`: emit nếu `post.creator !== actor`.
   - `likePost`: chỉ emit khi `index === -1` (tức vừa add like) và `post.creator !== actor`.
   - Payload: `{ kind: 'like'|'comment', postId, postTitle, actorName, at }`.
   - **Phụ thuộc**: sửa `auth` middleware decode thêm `name` từ JWT payload để có `req.userName`.

5. **Client SSE util** — `api/notificationStream.js`.

6. **Redux + UI** — slice `notifications` (`items[]`, `unreadCount`); `<NotificationBell />` trong navbar.

7. **Docs** — append `# A2 — Bell notifications` vào file này (xoá phần đề xuất này).

## Phụ thuộc / chú ý

- Bước 4 **cần** `auth` middleware có `req.userName`. Trong phần "Phân quyền" sắp làm, sẽ tiện cải tổ `auth` luôn → A2 đỡ vướng.
- Bước 1 (rename bus) phải làm cẩn thận: mọi caller cũ phải đổi đồng thời. Có thể tách thành 1 commit riêng.
