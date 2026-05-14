import {
    FETCH_USER_PROFILE,
    FETCH_USER_POSTS,
    PROFILE_START_LOADING,
    PROFILE_END_LOADING,
    PROFILE_RESET,
    DELETE,
    UPDATE,
    LIKE,
} from '../constants/actionType';

/* State slice cho trang Profile (tách khỏi `posts` để không nhầm với feed Home).
   - viewed: thông tin public của user đang xem (null khi chưa load / 404)
   - posts: bài của họ ở trang hiện tại
   - currentPage / numberOfPages: phân trang riêng
   - isLoading: trạng thái load đầu tiên (cả profile + posts)

   GHI CHÚ — vì sao profile reducer cần lắng nghe DELETE/UPDATE/LIKE
   ============================================================
   Slice này tách riêng `posts` để Profile page không lẫn với feed Home.
   Đánh đổi: các action chia sẻ (DELETE/UPDATE/LIKE) chạy ở reducer `posts`
   sẽ KHÔNG tự động propagate sang đây → user delete bài trên Profile thấy
   toast nhưng card vẫn nguyên, like trên Profile không cập nhật, v.v.
   Cách xử lý: profile listen các action ấy và áp vào `state.posts` của
   slice này — nội dung action không đổi (không cần action types mới). */
const initialState = {
    viewed: null,
    posts: [],
    currentPage: 1,
    numberOfPages: 1,
    isLoading: false,
};

export default function profileReducer(state = initialState, action) {
    switch (action.type) {
        case PROFILE_START_LOADING:
            return { ...state, isLoading: true };
        case PROFILE_END_LOADING:
            return { ...state, isLoading: false };
        case PROFILE_RESET:
            return initialState;
        case FETCH_USER_PROFILE:
            return { ...state, viewed: action.payload };
        case FETCH_USER_POSTS: {
            const p = action.payload || {};
            return {
                ...state,
                posts: Array.isArray(p.data) ? p.data : [],
                currentPage: p.currentPage ?? 1,
                numberOfPages: p.numberOfPages ?? 1,
            };
        }

        case DELETE: {
            /* Action payload là `id` (string) từ `actions/posts.js::deletePost`.
               - Chỉ giảm `viewed.postCount` nếu bài THUỘC grid hiện tại
                 (tránh trừ nhầm khi xoá post ở chỗ khác trong cùng session,
                 vd: user vào /posts/:id detail, xoá, rồi quay về profile —
                 lúc đó post không nằm trong grid profile nên không trừ). */
            const removedId = action.payload;
            const isPresent = state.posts.some(
                (p) => String(p._id) === String(removedId),
            );
            if (!isPresent) return state;

            const nextPosts = state.posts.filter(
                (p) => String(p._id) !== String(removedId),
            );
            const nextViewed = state.viewed
                ? {
                      ...state.viewed,
                      postCount: Math.max(0, (state.viewed.postCount ?? 0) - 1),
                  }
                : state.viewed;

            return { ...state, posts: nextPosts, viewed: nextViewed };
        }

        case UPDATE: {
            /* Replace post nếu nằm trong grid (vd: user sửa title/message
               qua Form trên Home rồi quay lại profile). */
            const upd = action.payload;
            if (!upd?._id) return state;
            return {
                ...state,
                posts: state.posts.map((p) =>
                    String(p._id) === String(upd._id) ? upd : p,
                ),
            };
        }

        case LIKE: {
            /* Giống reducer `posts`: merge thay vì replace để hỗ trợ cả
               full post (REST) lẫn partial `{_id, likes}` (SSE live like). */
            const upd = action.payload;
            if (!upd?._id) return state;
            return {
                ...state,
                posts: state.posts.map((p) =>
                    String(p._id) === String(upd._id) ? { ...p, ...upd } : p,
                ),
            };
        }

        default:
            return state;
    }
}
