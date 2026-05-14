import {START_LOADING, END_LOADING, FETCH_POST, FETCH_BY_SEARCH, FETCH_RELATED, FETCH_ALL, CREATE, UPDATE, DELETE, LIKE, COMMENT } from '../constants/actionType';

const emptyRelated = { relatedPosts: [], relatedForPostId: null };

export default (state = { isLoading: true, posts: [], relatedPosts: [], relatedForPostId: null }, action) => {
    switch (action.type){
        case START_LOADING:
            return { ...state, isLoading: true };
        case END_LOADING:
            return { ...state, isLoading: false };
        case FETCH_ALL:
            return { 
                ...state,
                posts: action.payload.data,
                currentPage: action.payload.currentPage,
                numberOfPages: action.payload.numberOfPages,
                ...emptyRelated,
            };
        case FETCH_BY_SEARCH:
                return {
                    ...state,
                    posts: Array.isArray(action.payload) ? action.payload : [],
                    ...emptyRelated,
                };
        case FETCH_RELATED: {
            const p = action.payload || {};
            const data = Array.isArray(p.data) ? p.data : [];
            const postId = p.postId != null ? String(p.postId) : null;
            return { ...state, relatedPosts: data, relatedForPostId: postId };
        }
        case FETCH_POST:
            return { ...state, post: action.payload, ...emptyRelated };
        case LIKE: {
            /* Merge thay vì replace để hỗ trợ cả 2 dạng payload:
               - REST trả về full post (khi user bấm like): { ...post, likes }
               - SSE 'like:update' chỉ gửi partial: { _id, likes } (tránh truyền base64 ảnh)
               Spread giữ nguyên các field khác (selectedFile, title, message, comments...). */
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
        case COMMENT:
            return {
                ...state,
                posts: state.posts.map((post) => {
                    if (post._id === action.payload._id) {
                        return action.payload;
                    }
                    return post;
                }),
                relatedPosts: (state.relatedPosts || []).map((post) => {
                    if (post._id === action.payload._id) {
                        return action.payload;
                    }
                    return post;
                }),
                post:
                    state.post && state.post._id === action.payload._id
                        ? action.payload
                        : state.post,
            };
        case CREATE:
            return { ...state, posts: [...state.posts, action.payload] };
        case UPDATE:
            return {
                ...state,
                posts: state.posts.map((posts) => (posts._id === action.payload._id ? action.payload : posts)),
                relatedPosts: (state.relatedPosts || []).map((p) =>
                    p._id === action.payload._id ? action.payload : p
                ),
            };
        case DELETE: 
            return {
                ...state,
                posts: state.posts.filter((posts) => posts._id !== action.payload),
                relatedPosts: (state.relatedPosts || []).filter((p) => p._id !== action.payload),
            };
        default:
            return state;
    }
}
 