import * as api from '../api';
import {
    FETCH_USER_PROFILE,
    FETCH_USER_POSTS,
    PROFILE_START_LOADING,
    PROFILE_END_LOADING,
    PROFILE_RESET,
} from '../constants/actionType';
import { notifyError, axiosErrorMessage } from '../utils/notify';

/* Fetch user info + bài viết của họ song song.
   Trang Profile cần cả 2 → Promise.allSettled để có response ~max(latency)
   thay vì sum, và để 2 request fail độc lập (không block nhau).

   Sau pass PROF-1 Phase M: Google user đã có User doc trong DB sau khi
   `/user/google` upsert → không cần fallback `self-local` cho profile
   trống của Google user nữa. */
export const getUserProfile = (id, page = 1) => async (dispatch) => {
    /* Thứ tự: RESET TRƯỚC, START_LOADING SAU.
       Lý do: `PROFILE_RESET` trả `initialState` (isLoading: false). Nếu để
       START_LOADING trước rồi RESET sau, RESET sẽ ghi đè isLoading về false
       → component vào nhánh "không tìm thấy người dùng" trong vài chục ms
       trước khi response về → nháy UI. */
    dispatch({ type: PROFILE_RESET });
    dispatch({ type: PROFILE_START_LOADING });

    try {
        const [userRes, postsRes] = await Promise.allSettled([
            api.fetchUserPublic(id),
            api.fetchPostsByCreator(id, page),
        ]);

        if (userRes.status === 'fulfilled') {
            dispatch({ type: FETCH_USER_PROFILE, payload: userRes.value.data });
        } else {
            notifyError(axiosErrorMessage(userRes.reason, 'Could not load user profile.'));
        }

        if (postsRes.status === 'fulfilled') {
            dispatch({ type: FETCH_USER_POSTS, payload: postsRes.value.data });
        } else {
            notifyError(axiosErrorMessage(postsRes.reason, 'Could not load user posts.'));
        }
    } finally {
        dispatch({ type: PROFILE_END_LOADING });
    }
};

/* Đổi trang trong profile mà không fetch lại user info. */
export const getUserPostsPage = (id, page) => async (dispatch) => {
    try {
        const { data } = await api.fetchPostsByCreator(id, page);
        dispatch({ type: FETCH_USER_POSTS, payload: data });
    } catch (error) {
        notifyError(axiosErrorMessage(error, 'Could not load page.'));
    }
};

export const resetProfile = () => ({ type: PROFILE_RESET });
