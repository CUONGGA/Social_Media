import {START_LOADING, END_LOADING, FETCH_BY_SEARCH, FETCH_ALL, CREATE, UPDATE, DELETE, LIKE } from '../constants/actionType';
export default (state = [], action) => {
    switch (action.type){
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
        case LIKE:
            return state.map((posts) => posts._id === action.payload._id ? action.payload : posts);
        case CREATE:
            return [ ...state, action.payload ];
        case UPDATE:
            return state.map((posts) => posts._id === action.payload._id ? action.payload : posts);
        case DELETE: 
            return state.filter((posts) => posts._id !== action.payload);
        default:
            return state;
    }
}
 