import React from 'react';
import { Container } from '@material-ui/core';
import { Switch, Route, Redirect, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar/navbar.js';
import Home from './components/Home/home.js';
import Auth from './components/Auth/Auth.js';
import PostDetails from './components/PostDetails/postdetails.jsx';
import Profile from './components/Profile/profile.jsx';
import { readStoredProfile, getUserId } from './utils/authUser';


const App = () => {
  const location = useLocation();
  const user = React.useMemo(() => {
    return JSON.parse(localStorage.getItem('profile'));
  }, [location]);

  /* `/me` là shortcut: redirect tới /users/<userId> nếu đã login,
     hoặc /auth nếu chưa. Đặt trong useMemo để chỉ tính lại khi route đổi. */
  const myUserId = React.useMemo(() => getUserId(readStoredProfile()), [location]);

  return (
    <Container maxWidth="xl">
      <Navbar />
      <Switch>
        <Route path="/" exact component={() => <Redirect to="/posts" />} />
        <Route path="/posts" exact component={Home} />
        <Route path="/posts/search" exact component={Home} />
        <Route path="/posts/:id" component={PostDetails} />
        <Route
          path="/me"
          exact
          component={() => (myUserId ? <Redirect to={`/users/${myUserId}`} /> : <Redirect to="/auth" />)}
        />
        <Route path="/users/:id" exact component={Profile} />
        <Route
          path="/auth"
          exact
          component={() => (!user ? <Auth /> : <Redirect to="/posts" />)}
        />
      </Switch>
    </Container>
  );
};

export default App;
