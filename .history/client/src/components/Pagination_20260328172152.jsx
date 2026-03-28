import React, {useEffect} from "react";
import { Button, ButtonGroup } from '@material-ui/core';
import { Pagination, PaginationItem } from '@material-ui/lab';
import useStyle from './styles.js';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

const Paginate = ({ page }) => {
    const classes = useStyle();

    useEffect(() => {
        if(!page) return;
    }, [page]);


    const goToPage = (targetPage) => {
        window.location.href = `/posts?page=${targetPage}`;
    };

    return (
        <Pagination classes={{ ul: classes.ul }} count={5} page={1} variant="outlined" color="primary" renderItem={(item) => (
            <PaginationItem {...item} component={Link} to={`/posts?page=${1}`} />
        )} />
    );
};

export default Paginate;