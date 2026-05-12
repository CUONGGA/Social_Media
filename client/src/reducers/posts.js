import {START_LOADING, END_LOADING, FETCH_POST, FETCH_BY_SEARCH, FETCH_ALL, CREATE, UPDATE, DELETE, LIKE, COMMENT } from '../constants/actionType';
export default (state = { isLoading: true, posts: [] }, action) => {
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
                numberOfPages: action.payload.numberOfPages
            };
        case FETCH_BY_SEARCH:
                return {
                    ...state,
                    posts: action.payload
                };
        case FETCH_POST:
            return { ...state, post: action.payload };
        case LIKE:
            return {
                ...state,
                posts: state.posts.map((p) => p._id === action.payload._id ? action.payload : p),
                post:
                    state.post && state.post._id === action.payload._id
                        ? action.payload
                        : state.post,
            };
        case COMMENT:
            return {
                ...state,
                posts: state.posts.map((post) => {
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
            return { ...state, posts: state.posts.map((posts) => posts._id === action.payload._id ? action.payload : posts) };
        case DELETE: 
            return { ...state, posts: state.posts.filter((posts) => posts._id !== action.payload) };
        default:
            return state;
    }
}
 