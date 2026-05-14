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

- **Live like count** trên trang chi tiết: cùng pattern, event `like:update` với `{ likes: string[] }`.
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
