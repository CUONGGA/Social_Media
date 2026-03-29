import React, { useState, useEffect } from "react";
import { Link, useHistory, useLocation } from "react-router-dom";
import { AppBar, Avatar, Toolbar, Typography, Button } from "@material-ui/core";
import { useDispatch } from "react-redux";
import { jwtDecode } from 'jwt-decode';
import useStyle from './styles';
import memoriesLogo from '../../images/memories-Logo.png';
import memoriesText from '../../images/memories-Text.png';

const Navbar = () => {
    const classes = useStyle();
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('profile')));
    const dispatch = useDispatch();
    const history = useHistory();
    const location = useLocation();
    const logout = () => {
        dispatch({ type:'LOGOUT' });
        history.push('/');
        setUser(null);
    }
    useEffect(() => {
        const token = user?.token;

        if(token) {
            // Check if token is expired
            const decodedToken = jwtDecode(token);
            if(decodedToken.exp * 1000 < new Date().getTime()) logout();
        }


        setUser(JSON.parse(localStorage.getItem('profile')));
    }, [location]);
    return (    
    <AppBar className={classes.appBar} position="static" color='inherit'>
        <Link to="/" className={classes.brandContainer}>
        <img src={memoriesText} alt="icon" height="55px" />
        <img className={classes.image} src={memoriesLogo} alt="icon" height="60px" />
        </Link>
        <Toolbar className={classes.toolbar}>
            {
                user ? ( 
                    <div className={classes.profile}>
                        <Avatar className={classes.purple} alt={user?.result?.name?.charAt(0)} src={user?.result?.picture}>
                            {user?.result?.name.charAt(0)}
                        </Avatar>
                        <Typography className={classes.userName} variant="h6">
                            {user?.result?.name}
                        </Typography>
                        <Button variant="contained" className={classes.logout} color="secondary" onClick={logout}>
                            Logout
                        </Button>
                    </div>
                ) : ( 
                    <Button component={Link} to="/auth" variant="contained" color="primary">
                        Sign In
                    </Button>
                )
            }
        </Toolbar>
    </AppBar>
    );
};

export default Navbar;