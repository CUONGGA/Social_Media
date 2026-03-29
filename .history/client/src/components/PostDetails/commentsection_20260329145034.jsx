import React, { useState, useRef } from 'react'
import { Typography, TextField, Button } from '@material-ui/core';
import { useDispatch } from 'react-redux';
import useStyle from './styles.js';

const CommentSection = ({ post }) => {
    const classes = useStyle();
    return (
        <div>
            <div className={classes.commentsOuterContainer}>
                <div className={classes.commentsInnerContainer}></div>
            </div>
            
        </div>
    )
}

export default CommentSection;
