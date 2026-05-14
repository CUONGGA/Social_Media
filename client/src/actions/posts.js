import * as api from '../api';
import {
  FETCH_POST,
  START_LOADING,
  END_LOADING,
  FETCH_BY_SEARCH,
  FETCH_RELATED,
  FETCH_ALL,
  CREATE,
  UPDATE,
  DELETE,
  LIKE,
} from '../constants/actionType';
import { notifySuccess, notifyError, notifyInfo, axiosErrorMessage } from '../utils/notify';
import { readStoredProfile, getUserId } from '../utils/authUser';

export const getPost = (id) => async (dispatch) => {
  try {
    dispatch({ type: START_LOADING });
    const { data } = await api.fetchPost(id);

    dispatch({ type: FETCH_POST, payload: data });
    dispatch({ type: END_LOADING });
  } catch (error) {
    notifyError(axiosErrorMessage(error, 'Could not load this memory.'));
    dispatch({ type: END_LOADING });
  }
};

export const getPosts = (page) => async (dispatch) => {
  try {
    dispatch({ type: START_LOADING });
    const { data } = await api.fetchPosts(page);

    dispatch({ type: FETCH_ALL, payload: data });
    dispatch({ type: END_LOADING });
  } catch (error) {
    notifyError(axiosErrorMessage(error, 'Could not load memories.'));
    dispatch({ type: END_LOADING });
  }
};

/** @param {object} searchQuery - { search, tags } */
/** @param {{ silent?: boolean, forPostId?: string }} [options] - forPostId: khi silent, gắn kết quả với bài đang xem (tránh hiển thị nhầm) */
export const getPostBySearch = (searchQuery, options = {}) => async (dispatch) => {
  const { silent = false } = options;
  try {
    if (!silent) dispatch({ type: START_LOADING });
    const { data: { data } } = await api.fetchPostBySearch(searchQuery);
    if (silent) {
      dispatch({
        type: FETCH_RELATED,
        payload: { data, postId: options.forPostId != null ? String(options.forPostId) : null },
      });
    } else {
      dispatch({ type: FETCH_BY_SEARCH, payload: data });
    }
    if (!silent) {
      dispatch({ type: END_LOADING });
      notifyInfo(`Found ${Array.isArray(data) ? data.length : 0} result(s).`);
    }
  } catch (error) {
    if (!silent) {
      notifyError(axiosErrorMessage(error, 'Search failed.'));
      dispatch({ type: END_LOADING });
    }
  }
};

/** @param {object} post */
export const createPost = (post, history) => async (dispatch) => {
  try {
    dispatch({ type: START_LOADING });
    const { data } = await api.createPost(post);
    history?.push(`/posts/${data._id}`);
    dispatch({ type: CREATE, payload: data });
    dispatch({ type: END_LOADING });
    notifySuccess('Memory created successfully.');
  } catch (error) {
    notifyError(axiosErrorMessage(error, 'Could not create memory.'));
    dispatch({ type: END_LOADING });
  }
};

export const updatePost = (id, post) => async (dispatch) => {
  try {
    const { data } = await api.updatePost(id, post);

    dispatch({ type: UPDATE, payload: data });
    notifySuccess('Memory updated.');
  } catch (error) {
    notifyError(axiosErrorMessage(error, 'Could not update memory.'));
  }
};

export const deletePost = (id) => async (dispatch) => {
  try {
    await api.deletePost(id);

    dispatch({ type: DELETE, payload: id });
    notifySuccess('Memory deleted.');
  } catch (error) {
    notifyError(axiosErrorMessage(error, 'Could not delete memory.'));
  }
};

/* Like với 3 thay đổi để bớt cảm giác chậm:
   1. Optimistic update: dispatch toggle ngay tại client → UI nhảy số tức thì,
      không đợi roundtrip server. Đây là phần "chính" làm bớt cảm giác chậm.
   2. Slim payload server: API giờ trả `{ _id, likes }` thay vì full post —
      reducer LIKE đã merge thay replace (từ A1) nên không phá field khác.
   3. Rollback khi fail: nếu server trả lỗi (401/404/500), restore likes về cũ
      và báo toast. Không để UI lệch với DB. */
export const likePost = (id) => async (dispatch, getState) => {
  const profile = readStoredProfile();
  const userId = getUserId(profile);
  if (!userId) {
    notifyError('Please sign in to like.');
    return;
  }

  /* Lấy snapshot `likes` hiện tại để toggle optimistic + rollback nếu cần.
     Đọc từ cả 3 nơi vì post có thể nằm ở `posts` (Home), `relatedPosts`
     (PostDetails) hoặc `post` (PostDetails current). */
  const { posts: { posts = [], relatedPosts = [], post: currentPost } = {} } = getState();
  const sourcePost =
    (currentPost && String(currentPost._id) === String(id) && currentPost) ||
    posts.find((p) => String(p._id) === String(id)) ||
    relatedPosts.find((p) => String(p._id) === String(id));

  const oldLikes = sourcePost?.likes ?? [];
  const isLiked = oldLikes.some((u) => String(u) === userId);
  const optimisticLikes = isLiked
    ? oldLikes.filter((u) => String(u) !== userId)
    : [...oldLikes, userId];

  dispatch({ type: LIKE, payload: { _id: id, likes: optimisticLikes } });

  try {
    const { data } = await api.likePost(id);
    /* Reconcile với DB. Trong trường hợp bình thường, `data.likes` trùng
       `optimisticLikes` → React thấy reference mới nhưng nội dung giống,
       chỉ re-render thừa 1 lần (không nhìn thấy được). */
    dispatch({ type: LIKE, payload: data });
  } catch (error) {
    dispatch({ type: LIKE, payload: { _id: id, likes: oldLikes } });
    notifyError(axiosErrorMessage(error, 'Could not update like.'));
  }
};

export const commentPost = (value, id) => async (dispatch) => {
  try {
    const { data } = await api.comment(value, id);
    if (!data?._id) return undefined;
    dispatch({ type: UPDATE, payload: data });
    notifySuccess('Comment posted.');
    return data.comments ?? [];
  } catch (error) {
    notifyError(axiosErrorMessage(error, 'Could not post comment.'));
  }
};
