import React, { useState, useEffect } from "react";
import { Link, useHistory, useLocation } from "react-router-dom";
import { AppBar, Avatar, Toolbar, Typography, Button, IconButton, Tooltip } from "@material-ui/core";
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import NightsStay from '@material-ui/icons/NightsStay';
import WbSunny from '@material-ui/icons/WbSunny';
import { useDispatch } from "react-redux";
import { useThemeMode } from '../../context/ThemeModeContext';
import { jwtDecode } from 'jwt-decode';
import useStyle from './styles';
import memoriesLogo from '../../images/memories-Logo.png';
import memoriesText from '../../images/memories-Text.png';

const Navbar = () => {
    const classes = useStyle();
    const { mode, toggleMode } = useThemeMode();
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
    <AppBar className={classes.appBar} position="static" color='inherit' elevation={0}>
        <Link to="/" className={classes.brandContainer}>
        <img src={memoriesText} alt="icon" height="55px" />
        <img className={classes.image} src={memoriesLogo} alt="icon" height="60px" />
        </Link>
        <Toolbar className={classes.toolbar}>
            <Tooltip title={mode === 'light' ? 'Dark mode' : 'Light mode'}>
                <IconButton
                    className={classes.themeToggle}
                    onClick={toggleMode}
                    aria-label={mode === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
                >
                    {mode === 'light' ? <NightsStay /> : <WbSunny />}
                </IconButton>
            </Tooltip>
            {
                user ? ( 
                    <div className={classes.profile}>
                        <Avatar className={classes.purple} alt={user?.result?.name?.charAt(0)} src={user?.result?.picture}>
                            {user?.result?.name.charAt(0)}
                        </Avatar>
                        <Typography className={classes.userName} component="span" variant="body1">
                            {user?.result?.name}
                        </Typography>
                        <Button
                            variant="outlined"
                            className={classes.logout}
                            color="default"
                            onClick={logout}
                            disableElevation
                            startIcon={<ExitToAppIcon className={classes.logoutIcon} />}
                        >
                            Logout
                        </Button>
                    </div>
                ) : ( 
                    <Button component={Link} to="/auth" variant="contained" color="primary" className={classes.signInButton} disableElevation>
                        Sign In
                    </Button>
                )
            }
        </Toolbar>
    </AppBar>
    );
};

export default Navbar;