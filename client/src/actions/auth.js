import * as api from '../api';
import { FETCH_ALL, CREATE, UPDATE, DELETE} from '../constants/actionType';
import { AUTH } from '../constants/actionType';

export const signin = (formData, history) => async (dispatch) => {
    try {
        const { data } = await api.signIn(formData);

        dispatch({ type: AUTH, data })

        history.push('/');
    } catch (error) {
        console.log(error.message);
    }    
}

export const signup = (formData, history) => async (dispatch) => {
    try {
        const { data } = await api.signUp(formData);

        dispatch({ type: AUTH, data })

        history.push('/');
    } catch (error) {
        console.log(error.message);
    }    
}