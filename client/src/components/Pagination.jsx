import React, { useEffect } from 'react';
import { Pagination } from '@material-ui/lab';
import useStyle from './styles.js';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getPosts } from '../actions/posts.js';

const Paginate = ({ page }) => {
    const { numberOfPages } = useSelector((state) => state.posts);
    const classes = useStyle();
    const dispatch = useDispatch();
    const history = useHistory();
    const total = Math.max(Number(numberOfPages) || 1, 1);
    const pageNum = Math.max(1, parseInt(String(page), 10) || 1);
    const current = Math.min(pageNum, total);
    const compactEllipsis = total > 3;

    useEffect(() => {
        dispatch(getPosts(current));
    }, [current, dispatch]);

    const handleChange = (e, value) => {
        history.push(`/posts?page=${value}`);
    };

    return (
        <Pagination
            classes={{ ul: classes.ul }}
            count={total}
            page={current}
            variant="outlined"
            color="primary"
            boundaryCount={1}
            siblingCount={compactEllipsis ? 0 : 1}
            onChange={handleChange}
        />
    );
};

export default Paginate;