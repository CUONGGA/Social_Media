import React, { useState, useEffect } from 'react'
import { Container, Grow, Grid, Paper, AppBar, TextField, Button } from '@material-ui/core';
import Posts from '../Posts/posts';
import Form from '../Forms/form';
import Paginate from '../Pagination';
import ChipInput from '@material-ui/core';
import { useDispatch } from 'react-redux';
import { getPosts } from '../../actions/posts';
import { useHistory, useLocation } from 'react-router-dom';

function useQuery() {
    return new URLSearchParams(useLocation().search);
}

const Home = () => {
    const [currentId, setCurrentId] = useState(0);
    const dispatch = useDispatch();
    const query = useQuery();
    const history = useHistory();
    const page = query.get('page') || 1;
    const searchQuery = query.get('searchQuery');

    useEffect(() => {
        dispatch(getPosts());
    }, [currentId ,dispatch]);
  return (
    <Grow in>
    <Container maxWidth="xl">
        <Grid  container justifyContent ="space-between" alignItems="stretch" spacing={3} className={classes.gridContainer}>
            <Grid item xs={12} sm={6} md={9}>
                <Posts setCurrentId={setCurrentId} />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
                <Form currentId={currentId} setCurrentId={setCurrentId} />
                <Paper elevation={6}>
                    <Paginate />
                </Paper>
            </Grid>
        </Grid>
    </Container>
    </Grow>
  )
}

export default Home