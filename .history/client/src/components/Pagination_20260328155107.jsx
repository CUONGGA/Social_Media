import React from "react";
import { Button, ButtonGroup } from '@material-ui/core';
import { Pagination, PaginationItem } from '@material-ui/lab';
import useStyle from './styles.js';

const Pagination = ({ page = 1 }) => {
    const classes = useStyle();

    const goToPage = (targetPage) => {
        window.location.href = `/posts?page=${targetPage}`;
    };

    return (
        <div className={classes.pagination}>
            <ButtonGroup color="primary" aria-label="pagination">
                <Button onClick={() => goToPage(Number(page) - 1)} disabled={Number(page) <= 1}>
                    Previous
                </Button>
                <Button disabled>Page {page}</Button>
                <Button onClick={() => goToPage(Number(page) + 1)}>Next</Button>
            </ButtonGroup>
        </div>
    );
};

export default Pagination;