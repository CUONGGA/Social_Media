    import * as api from '../api';
    import { FETCH_POST ,START_LOADING, END_LOADING, FETCH_BY_SEARCH, FETCH_ALL, CREATE, UPDATE, DELETE, LIKE, COMMENT } from '../constants/actionType';

    export const getPost = (id) => async (dispatch) => {
        try {
            dispatch({ type: START_LOADING });
            const { data } = await api.fetchPost(id);

            dispatch({ type: FETCH_POST, payload: data });
            dispatch({ type: END_LOADING });
        } catch (error) {
            console.log(error.message);
            dispatch({ type: END_LOADING });
        }
    }

    export const getPosts = (page) => async (dispatch) => {
        try {
            dispatch({ type: START_LOADING });
            const { data } = await api.fetchPosts(page); 

            dispatch({type: FETCH_ALL, payload: data});
            dispatch({ type: END_LOADING });
        } catch (error) {
            console.log(error.message);
            dispatch({ type: END_LOADING });
        }
    }

    /** @param {object} searchQuery - { search, tags } */
    /** @param {{ silent?: boolean }} [options] - silent: do not toggle global isLoading (use on post detail page) */
    export const getPostBySearch = (searchQuery, options = {}) => async (dispatch) => {
        const { silent = false } = options;
        try {
            if (!silent) dispatch({ type: START_LOADING });
            const { data: { data } } = await api.fetchPostBySearch(searchQuery);
            dispatch({ type: FETCH_BY_SEARCH, payload: data });
            if (!silent) dispatch({ type: END_LOADING });
        } catch (error) {
            console.log(error.message);
            if (!silent) dispatch({ type: END_LOADING });
        }
    };

    export const createPost = (post, history) => async (dispatch) => {
        try {
            dispatch({ type: START_LOADING });
            const { data } = await api.createPost(post);
            history?.push(`/posts/${data._id}`);
            dispatch( {type: CREATE, payload: data });
            dispatch({ type: END_LOADING });
        } catch (error) {
            console.log(error);
        }
    }

    export const updatePost = (id, post) => async (dispatch) => {
        try {
            const { data } = await api.updatePost(id, post);

            dispatch ({type: UPDATE, payload: data})
        } catch (error) {
            console.log(error);
        }
    }

    export const deletePost = (id) => async (dispatch) => {
        try {
            await api.deletePost(id);

            dispatch({ type: DELETE, payload: id });
        } catch (error) {
            console.log(error);
        }
    }

    export const likePost = (id) => async (dispatch) => {
        try {
            const { data } = await api.likePost(id);

            dispatch({ type: LIKE, payload: data });
        } catch (error) {
            console.log(error); 
        }
    }

    export const commentPost = (value, id) => async (dispatch) => {
        try {
            const { data } = await api.comment(value, id);

            dispatch({ type: UPDATE, payload: data });
            return data.comments;
        } catch (error) {
            console.log(error);
        }
    }