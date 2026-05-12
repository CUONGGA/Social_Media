import * as api from '../api';
import { AUTH } from '../constants/actionType';
import { notifySuccess, notifyError, axiosErrorMessage } from '../utils/notify';

export const signin = (formData, history) => async (dispatch) => {
  try {
    const { data } = await api.signIn(formData);

    dispatch({ type: AUTH, data });

    notifySuccess('Signed in successfully.');
    history.push('/posts');
  } catch (error) {
    notifyError(axiosErrorMessage(error, 'Sign in failed.'));
  }
};

export const signup = (formData, history) => async (dispatch) => {
  try {
    const { data } = await api.signUp(formData);

    dispatch({ type: AUTH, data });

    notifySuccess('Account created. Welcome!');
    history.push('/posts');
  } catch (error) {
    notifyError(axiosErrorMessage(error, 'Sign up failed.'));
  }
};
