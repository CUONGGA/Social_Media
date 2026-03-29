import React, { useState } from 'react'
import { Avatar, Button, Paper, Grid, Typography, Container} from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import useStyle from './styles';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Input from './Input.js';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import { useDispatch } from 'react-redux';
import { signin, signup } from '../../actions/auth.js';

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

    googleSuccess = async (res) => {
      const result = jwtDecode(res.credential);
      const token = res.credential;
      try {
        dispatch({ type: 'AUTH', data: { result, token } });
        history.push('/');
      } catch (error) {
        console.log(error);
      }
    };

    googleFailure = (error) => {
      console.log('Google Sign In was unsuccessful. Try again later.');
      console.log(error);
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
                clientId = "GOOGLE ID"
                render={(renderProps) => (
                    <Button className={classes.googleButton} color="primary" fullWidth onClick={renderProps.onClick} disabled={renderProps.disabled} startIcon={<Icon />} variant="contained">
                        Google Sign In
                    </Button>
                )}
                onSuccess={googleSuccess}
                onFailure={googleFailure}
                cookiePolicy="single_host_origin"
              />
          <Grid container justifyContent='flex-end'>
                <Grid item>
                  <Button onClick={switchMode}>
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