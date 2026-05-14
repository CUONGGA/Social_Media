import React, { useState } from 'react'
import { Avatar, Button, Paper, Grid, Typography, Container} from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import useStyle from './styles';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Input from './Input.js';
import { GoogleLogin } from '@react-oauth/google';
import { useDispatch } from 'react-redux';
import { signin, signup, googleSignIn } from '../../actions/auth.js';
import { notifyError } from '../../utils/notify';


const initialState = { firstName: '', lastName: '', email: '', password: '', confirmPassword: '' };

const Auth = () => {
    const classes = useStyle();
    const [isSignup, setIsSignup] = useState(false);
    const [ShowPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState(initialState);
    const dispatch = useDispatch();
    const history = useHistory();
    const handleShowPassword = () => setShowPassword((prevShowPassword) => !prevShowPassword);
    const handleSubmit = (e) => {
      e.preventDefault();
      if (isSignup) {
        dispatch(signup(formData, history))
      } else {
        dispatch(signin(formData, history))
      }
    }
    const handleChange = (e) => {
      setFormData({...formData, [e.target.name]: e.target.value});
    }
    const switchMode = () => {
      setIsSignup((prevIsSignup) => !prevIsSignup);
      setShowPassword(false);
    };

    const googleSuccess = async (res) => {
      /* Trước đây: decode Google ID token ngay tại client rồi lưu thẳng
         credentials Google vào localStorage. Hệ luỵ:
         - userId trong app = Google `sub` (không phải ObjectId Mongo) → mọi
           query DB phải xử lý 2 kiểu id (sub vs ObjectId).
         - User Google không có document trong DB → trang hồ sơ 404.

         Bây giờ: gửi token sang server `/user/google`. Server upsert User
         doc, migrate post.creator nếu cần, trả về JWT **local** + User doc.
         Frontend lưu giống local signin → mọi flow downstream nhất quán. */
      const token = res?.credential;
      if (!token) {
        notifyError('Google sign-in returned no credential.');
        return;
      }
      dispatch(googleSignIn(token, history));
    };

    const googleFailure = () => {
      notifyError('Google sign-in was cancelled or failed. Please try again.');
    };


  return (
    <Container component="main" maxWidth="xs">
      <Paper className={classes.paper} elevation={3}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography variant='h5'>{isSignup ? 'Sign Up' : 'Sign In'}</Typography>
        <form className={classes.form} onSubmit={handleSubmit}>
          <Grid container spacing={2}>
              {
                isSignup && (
                  <>
                    <Input name='firstName' label='First Name' handleChange={handleChange} autoFocus half/>
                    <Input name='lastName' label='Last Name' handleChange={handleChange} half/>
                  </>
                )}
                <Input name="email" label="Email Address" handleChange={handleChange} type="email"/>
                <Input name="password" label="Password" handleChange={handleChange} type={ShowPassword ? "text" : "password"} handleShowPassword={handleShowPassword}/>
                { isSignup && <Input name="confirmPassword" label="Repeat Password" handleChange={handleChange} type="password"></Input> }
          </Grid>
          <Button type="submit" fullWidth variant='contained' color='primary' className={classes.submit}>{ isSignup ? 'Sign Up' : 'Sign In' }</Button>
          <GoogleLogin
                className={classes.googleButton}
                clientId = "GOOGLE ID"
                onSuccess={googleSuccess}
                onFailure={googleFailure}
                cookiePolicy="single_host_origin"
              />
          <Grid container justifyContent='flex-end'>
                <Grid item>
                  <Button onClick={switchMode} className={classes.switchMode}>
                      { isSignup ? 'Already have an account? Sign in' : "Don't have an account? Sign Up" }
                  </Button>
                </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  )
}

export default Auth