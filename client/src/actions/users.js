import * as api from '../api';
import {
    FETCH_USER_PROFILE,
    FETCH_USER_POSTS,
    PROFILE_START_LOADING,
    PROFILE_END_LOADING,
    PROFILE_RESET,
    AUTH,
} from '../constants/actionType';
import { notifySuccess, notifyError, axiosErrorMessage } from '../utils/notify';

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

/* PATCH /user/:id — sửa hồ sơ (PROF-5). Server-side đã chặn 403 nếu không phải
   owner; thunk này tin tưởng server và xử lý 2 việc bên client:
   1. Cập nhật `state.profile.viewed` — header Profile reflect ngay.
   2. Nếu user đang sửa CHÍNH MÌNH: dispatch AUTH với `result` mới để:
      - `state.auth.authData` cập nhật.
      - `localStorage.profile` ghi đè (auth reducer làm sẵn).
      → Navbar (đã subscribe authData) render avatar/tên mới ngay.

   Trả về boolean để caller (dialog) biết success/fail mà đóng modal hay không. */
export const updateUserProfile = (id, payload) => async (dispatch, getState) => {
    try {
        const { data } = await api.updateUserProfile(id, payload);

        /* Profile slice: merge với viewed cũ để giữ các field server không trả
           (vd: nếu tương lai có field nào đó). Server hiện trả đầy đủ shape
           giống getUserPublic nên replace cũng OK, nhưng merge an toàn hơn. */
        const currentViewed = getState().profile?.viewed || {};
        dispatch({
            type: FETCH_USER_PROFILE,
            payload: { ...currentViewed, ...data },
        });

        /* Sync với auth slice nếu là chính mình. AUTH reducer ghi luôn localStorage. */
        try {
            const raw = localStorage.getItem('profile');
            const stored = raw ? JSON.parse(raw) : null;
            const myId = stored?.result?._id;
            if (stored && myId && String(myId) === String(id)) {
                const mergedResult = {
                    ...stored.result,
                    name: data.name,
                    picture: data.picture,
                    bio: data.bio,
                };
                dispatch({ type: AUTH, data: { result: mergedResult, token: stored.token } });
            }
        } catch { /* localStorage không đọc được → bỏ qua sync, profile slice vẫn đúng */ }

        notifySuccess('Hồ sơ đã được cập nhật.');
        return true;
    } catch (error) {
        notifyError(axiosErrorMessage(error, 'Cập nhật hồ sơ thất bại.'));
        return false;
    }
};

/* PATCH /user/me/password — đổi mật khẩu. Trả về:
   - `true` nếu thành công.
   - `{ code: 'NO_PASSWORD' }` nếu user Google không có mật khẩu local
     (dialog sẽ render UI khác). Để FE phân biệt: thay vì chỉ true/false,
     return string code khi cần. Caller xử lý:
       const result = await dispatch(changePassword(...));
       if (result === true) closeDialog();
       else if (result?.code === 'NO_PASSWORD') showGoogleHint();
   - `false` cho mọi lỗi khác (đã hiện toast).

   KHÔNG đụng tới state Redux — đổi mật khẩu không thay đổi UI nào;
   JWT cũ vẫn valid (server chỉ đổi `user.password` hash). */
export const changePassword = (payload) => async () => {
    try {
        await api.changePassword(payload);
        notifySuccess('Đã đổi mật khẩu.');
        return true;
    } catch (error) {
        const code = error?.response?.data?.code;
        if (code === 'NO_PASSWORD') {
            /* Không hiện toast cho case này — dialog sẽ render banner riêng,
               toast trùng lặp thông tin. */
            return { code: 'NO_PASSWORD' };
        }
        notifyError(axiosErrorMessage(error, 'Đổi mật khẩu thất bại.'));
        return false;
    }
};
