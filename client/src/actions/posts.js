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

export const likePost = (id) => async (dispatch) => {
  try {
    const { data } = await api.likePost(id);

    dispatch({ type: LIKE, payload: data });
  } catch (error) {
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
