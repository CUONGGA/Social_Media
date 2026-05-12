# Nhật ký thay đổi — ngày 1 (12/05/2026)

## Mục tiêu

- Khắc phục hiện tượng **“You might also like”** tạm thời hiển thị **cùng dữ liệu với feed trang chủ** (~0,5 giây) trước khi đúng nội dung gợi ý theo tag của bài đang xem.

## Nguyên nhân

- Trang chi tiết bài (`PostDetails`) dùng chung `posts` trong Redux với danh sách trang chủ / kết quả tìm kiếm.
- Khi gọi tìm theo tag với `silent: true`, action vẫn cập nhật `FETCH_BY_SEARCH` → UI lọc `posts` và thấy “gần như cả feed” cho đến khi request mới xong.

## Cách xử lý

1. **State riêng cho gợi ý liên quan**  
   - Thêm action `FETCH_RELATED` và trong reducer `posts`: `relatedPosts`, `relatedForPostId`.  
   - Khi `FETCH_ALL`, `FETCH_BY_SEARCH`, `FETCH_POST`: xóa related (không dính ngữ cảnh cũ).  
   - Các action `LIKE`, `COMMENT`, `UPDATE`, `DELETE`: đồng bộ cả `relatedPosts` với `posts` khi cần.

2. **Action `getPostBySearch`** (`client/src/actions/posts.js`)  
   - `silent: false` (ví dụ trang Home): giữ `FETCH_BY_SEARCH` như cũ.  
   - `silent: true` (trang chi tiết): dispatch `FETCH_RELATED` với `{ data, postId }` (`forPostId` từ options), **không** ghi đè `posts`.

3. **UI `PostDetails`** (`client/src/components/PostDetails/postdetails.jsx`)  
   - Đọc `relatedPosts`, `relatedForPostId` từ store.  
   - Chỉ render “You might also like” khi `String(relatedForPostId) === String(id)` trên URL và lọc bỏ bài hiện tại.  
   - Gọi `getPostBySearch(..., { silent: true, forPostId: post._id })`.

## File đã chạm

| File | Thay đổi chính |
|------|----------------|
| `client/src/constants/actionType.js` | Thêm `FETCH_RELATED`. |
| `client/src/reducers/posts.js` | `relatedPosts`, `relatedForPostId`, xử lý `FETCH_RELATED`, merge/clear related ở các action liên quan. |
| `client/src/actions/posts.js` | Nhánh silent → `FETCH_RELATED` + `forPostId`. |
| `client/src/components/PostDetails/postdetails.jsx` | Dùng related state thay vì `posts` cho khối gợi ý. |
| `docs/ngay1.md` | Nhật ký thay đổi ngày 1 (tài liệu). |

## Kiểm tra

- Build client: `react-scripts build` — thành công (có cảnh báo ESLint sẵn có ở file khác, không liên quan trực tiếp thay đổi này).

---

## Chi tiết bổ sung (để sau này đọc lại cho nhanh)

### Luồng dữ liệu (tóm tắt)

1. User mở `/posts/:id` → `getPost(id)` → `FETCH_POST` (trong reducer có spread `emptyRelated` → `relatedPosts = []`, `relatedForPostId = null`).
2. Khi `post` khớp `id` trong URL → `getPostBySearch({ search: 'none', tags: ... }, { silent: true, forPostId: post._id })`.
3. API trả mảng bài → `FETCH_RELATED` với `payload: { data, postId }`.
4. `PostDetails` chỉ render “You might also like” khi `relatedForPostId` trùng `id` trên URL → tránh flash feed và tránh dùng kết quả của request cũ khi chuyển bài nhanh.

### Hợp đồng Redux (FETCH_RELATED)

- **Payload:** `{ data: Post[], postId: string | null }` — `data` nên là mảng; reducer ép `Array.isArray`, không phải mảng thì thành `[]`.
- **`relatedForPostId`:** luôn lưu dạng string (trong thunk đã `String(options.forPostId)` khi có giá trị).

### Tham chiếu mã (điểm neo)

- Khai báo thunk và nhánh `silent`: `client/src/actions/posts.js` (khoảng dòng 42–67).
- Điều kiện hiển thị gợi ý: `client/src/components/PostDetails/postdetails.jsx` (`relatedReady`, `recommendedPosts`, khoảng dòng 43–51 và 83–87).

### File **liên quan** nhưng **không** sửa trong đợt này

| File | Vì sao vẫn đúng |
|------|------------------|
| `client/src/components/Home/home.js` | Gọi `getPostBySearch(...)` **không** `silent` → vẫn `FETCH_BY_SEARCH`, không đụng `relatedPosts`. |
| `client/src/api` (hoặc module gọi `fetchPostBySearch`) | Backend / axios giữ nguyên; chỉ đổi **cách dispatch** kết quả trên client. |
| `server/` | Không đổi endpoint; vẫn là cùng API search theo tag. |

### Gợi ý ghi thêm sau này (nếu cần)

- **Screenshot / video** trước–sau (tùy quy trình team).
- **Edge case:** bài không có tag (`tags` rỗng) — API trả gì thì UI hiện theo đó (có thể không có khối gợi ý).
- **Cải tiến có thể làm thêm:** skeleton/placeholder riêng cho khối “You might also like”, hoặc hủy request cũ bằng `AbortController` (hiện đã giảm rủi ro nhờ so khớp `relatedForPostId` với `id`).

### Mức độ “đầy đủ”

- **Đủ cho handoff:** mục tiêu, nguyên nhân, luồng Redux/UI, danh sách file đụng, file không sửa, hợp đồng payload — đã có ở trên.
- **Ghi chép artifact:** file nhật ký này là `docs/ngay1.md` (không ảnh hưởng runtime).

### Hành vi `silent: true` (trong `getPostBySearch`)

- **Không** `START_LOADING` / `END_LOADING` (tránh che màn hình chi tiết).
- **Không** toast `notifyInfo` / `notifyError` cho nhánh thành công (lỗi silent cũng không báo — chỉ log ngầm qua không dispatch).

### API client (không đổi logic)

- `fetchPostBySearch` khai báo tại `client/src/api/index.js` — vẫn gọi cùng endpoint server; thay đổi chỉ nằm ở **dispatch** sau khi có response.

### Hạn chế nhỏ trong reducer (biết để sau này không thắc mắc)

- **`CREATE`:** chỉ nối thêm vào `posts`, **không** tự thêm vào `relatedPosts`. Hợp lý vì bài mới chưa nằm trong danh sách “gợi ý” đã tải; nếu sau này muốn related luôn chứa bài vừa tạo (trường hợp hiếm) thì phải mở rộng thêm.
