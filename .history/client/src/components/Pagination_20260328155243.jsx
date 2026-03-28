import React from "react";
import { Button, ButtonGroup } from '@material-ui/core';
import { Pagination, PaginationItem } from '@material-ui/lab';
import useStyle from './styles.js';
import { Link } from "react-router-dom/cjs/react-router-dom.min.js";

const Pagination = ({ page = 1 }) => {
    const classes = useStyle();

    const goToPage = (targetPage) => {
        window.location.href = `/posts?page=${targetPage}`;
    };

    return (
        <Pagination classes={{ ul: classes.ul }} count={5} page={1} variant="outlined" color="primary" renderItem={(item) => (
            <PaginationItem {...item} onClick={() => goToPage(item.page)} />
        )} />
    );
};

export default Pagination;