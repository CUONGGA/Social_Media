import {
    FETCH_USER_PROFILE,
    FETCH_USER_POSTS,
    PROFILE_START_LOADING,
    PROFILE_END_LOADING,
    PROFILE_RESET,
} from '../constants/actionType';

/* State slice cho trang Profile (tách khỏi `posts` để không nhầm với feed Home).
   - viewed: thông tin public của user đang xem (null khi chưa load / 404)
   - posts: bài của họ ở trang hiện tại
   - currentPage / numberOfPages: phân trang riêng
   - isLoading: trạng thái load đầu tiên (cả profile + posts) */
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
        default:
            return state;
    }
}
