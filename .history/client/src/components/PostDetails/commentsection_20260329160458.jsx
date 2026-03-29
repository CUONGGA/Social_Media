import React, { useState, useRef } from 'react'
import { Typography, TextField, Button } from '@material-ui/core';
import { useDispatch } from 'react-redux';
import useStyle from './styles.js';
import { commentPost } from '../../actions/posts.js';

const CommentSection = ({ post }) => {
    const classes = useStyle();
    const [comments, setComments] = useState(post?.comments);
    const [comment, setComment] = useState('');
    const user = JSON.parse(localStorage.getItem('profile'));
    const dispatch = useDispatch();


    const handleClick = () => {
        const finalComment = `${user.result.name}: ${comment}`;

        dispatch(commentPost(finalComment, post._id));
        setComments([...comments, finalComment]);
        setComment('');
        commentsRef.current.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <div>
            <div className={classes.commentsOuterContainer}>
                <div className={classes.commentsInnerContainer}>
                    <Typography gutterBottom variant="h6">Comments</Typography>
                    {comments.map((c, i) => (
                        <Typography key={i} gutterBottom variant="subtitle1">
                            {c}
                        </Typography>
                    ))}
                </div>
                {user?.result?.name && (
                    <div style={{width: '70%'}}>
                        <Typography gutterBottom variant="h6">Write a Comment</Typography>
                        <TextField fullWidth rows={4} variant="outlined" label="Comment" multiline value={comment} onChange={(e) => setComment(e.target.value)} />
                        <Button style={{ marginTop: '10px' }} fullWidth disabled={!comment} variant="contained" onClick={handleClick} color="primary">Comment</Button>
                    </div>
                )}
            </div>
        </div>
    )
}

export default CommentSection;
