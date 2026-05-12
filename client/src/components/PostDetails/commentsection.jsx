import React, { useState, useRef, useEffect } from 'react'
import { Typography, TextField, Button } from '@material-ui/core';
import { useDispatch } from 'react-redux';
import useStyle from './styles.js';
import { commentPost } from '../../actions/posts.js';

/** Tách "Tên: nội dung" chỉ tại dấu ": " đầu tiên (trùng định dạng lúc gửi), giữ nguyên mọi dấu : trong nội dung. */
function splitCommentAuthorBody(raw) {
    const sep = ': ';
    const i = raw.indexOf(sep);
    if (i === -1) return { author: raw, body: '' };
    return { author: raw.slice(0, i), body: raw.slice(i + sep.length) };
}

const CommentSection = ({ post }) => {
    const classes = useStyle();
    const [comments, setComments] = useState(() => post?.comments ?? []);
    const [comment, setComment] = useState('');
    const commentReft = useRef();
    const userRaw = localStorage.getItem('profile');
    const user = userRaw ? JSON.parse(userRaw) : null;
    const dispatch = useDispatch();

    useEffect(() => {
        setComments(post?.comments ?? []);
    }, [post]);

    const handleClick = async () => {
        const finalComment = `${user.result.name}: ${comment}`;

        const newComments = await dispatch(commentPost(finalComment, post._id));

        if (newComments) setComments(newComments);
        setComment('');

        commentReft.current.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <div className={classes.commentsSection}>
            <div className={classes.commentsListBlock}>
                <Typography variant="h6" className={classes.commentsListHeading}>
                    Comments
                </Typography>
                <div className={classes.commentsScroll}>
                    {(comments ?? []).map((c, i) => {
                        const { author, body } = splitCommentAuthorBody(c);
                        return (
                            <Typography key={i} gutterBottom variant="subtitle2" component="div">
                                <strong>{author}</strong>
                                {author ? ': ' : ''}
                                {body}
                            </Typography>
                        );
                    })}
                    <div ref={commentReft} />
                </div>
            </div>
            {user?.result?.name && (
                <div className={classes.writeCommentBlock}>
                    <Typography variant="h6" className={classes.writeCommentHeading}>
                        Write a comment
                    </Typography>
                    <TextField
                        fullWidth
                        rows={3}
                        variant="outlined"
                        label="Your comment"
                        multiline
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                    />
                    <Button
                        style={{ marginTop: 12 }}
                        disabled={!comment}
                        variant="contained"
                        onClick={handleClick}
                        color="primary"
                    >
                        Post comment
                    </Button>
                </div>
            )}
        </div>
    )
}

export default CommentSection;
