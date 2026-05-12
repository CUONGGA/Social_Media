import React, { useState, useEffect } from 'react'
import { Container, Grow, Grid, Paper, TextField, Button, Typography } from '@material-ui/core';
import Posts from '../Posts/posts';
import Form from '../Forms/form';
import Paginate from '../Pagination';
import ChipInput from 'material-ui-chip-input';
import useStyle from './styles';
import { useDispatch } from 'react-redux';
import { getPosts, getPostBySearch } from '../../actions/posts';
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
    const classes = useStyle();
    const [search, setSearch] = useState('');
    const [tags, setTags] = useState([]);

    const handleAdd = (tag) => setTags([...tags, tag]);

    const handleDelete = (tagToDelete) => setTags(tags.filter((tag) => tag !== tagToDelete));

    const searchPost = () => {
        if(search.trim() || tags.length > 0) {
            dispatch(getPostBySearch({ search, tags: tags.join(',') }));
            history.push(`/posts/search?searchQuery=${search || 'none'}&tags=${tags.join(',')}`);
        } else {
            history.push('/');
        }
    };

    useEffect(() => {
    dispatch(getPosts(page));
    }, [dispatch, currentId, page]);
  return (
    <Grow in>
    <Container maxWidth="xl">
        <Grid  container justifyContent ="space-between" alignItems="stretch" spacing={3} className={classes.gridContainer}>
            <Grid item xs={12} sm={6} md={9}>
                <Posts setCurrentId={setCurrentId} />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
                <Paper className={classes.searchPaper} elevation={6}>
                    <div className={`${classes.searchInner} ${classes.searchFieldsRoot}`}>
                        <Typography className={classes.searchTitle} component="h2">
                            Search Memories
                        </Typography>
                        <TextField
                            name="search"
                            variant="outlined"
                            label="Search by title"
                            placeholder="Try a keyword…"
                            onKeyDown={(e) => e.key === 'Enter' && searchPost()}
                            fullWidth
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        <ChipInput
                            className={classes.chipInput}
                            value={tags}
                            onAdd={handleAdd}
                            onDelete={handleDelete}
                            label="Search by tags"
                            variant="outlined"
                            fullWidth
                            placeholder="e.g. vacation — Enter"
                        />
                        <Button
                            type="button"
                            onClick={searchPost}
                            className={classes.searchButton}
                            variant="contained"
                            color="primary"
                            disableElevation
                            fullWidth
                        >
                            Search
                        </Button>
                    </div>
                </Paper>
                <Form currentId={currentId} setCurrentId={setCurrentId} />
                {(!searchQuery && !tags.length) && (
                     <Paper elevation={6} className={classes.pagination}>
                        <Paginate page={page} />
                    </Paper>
                )}
            </Grid>
        </Grid>
    </Container>
    </Grow>
  )
}

export default Home