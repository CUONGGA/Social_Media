import React, { useState, useRef } from 'react'
import { Typography, TextField, Button } from '@material-ui/core';
import { useDispatch } from 'react-redux';
import useStyle from './styles.js';

const CommentSection = ({ post }) => {
    const classes = useStyle();
    const [comments, setComment] = useState([]);
    const dispatch = useDispatch();
    const commentsRef = useRef();

    return (
        <div>
            <div className={classes.commentsOuterContainer}>
                <div className={classes.commentsInnerContainer}>
                    <Typography gutterBottom variant="h6">Comments</Typography>
                    {comments?.map((c, i) => (
                        <Typography key={i} gutterBottom variant="subtitle1">
                            Comment {i}
                        </Typography>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default CommentSection;
