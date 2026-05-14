import React, { useState, useRef, useEffect } from 'react'
import { Typography, TextField, Button } from '@material-ui/core';
import { useDispatch } from 'react-redux';
import useStyle from './styles.js';
import { commentPost } from '../../actions/posts.js';
import { openCommentStream } from '../../api/commentStream.js';

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

    /* Realtime: lắng nghe SSE để thấy comment người khác gửi mà không cần refresh.
       Gắn lại stream mỗi khi đổi sang post khác. */
    useEffect(() => {
        const postId = post?._id;
        if (!postId) return undefined;
        const close = openCommentStream(postId, {
            onNewComment: ({ comments: serverComments }) => {
                if (Array.isArray(serverComments)) setComments(serverComments);
            },
        });
        return close;
    }, [post?._id]);

    const handleClick = async () => {
        const finalComment = `${user.result.name}: ${comment}`;

        const newComments = await dispatch(commentPost(finalComment, post._id));

        if (newComments) setComments(newComments);
        setComment('');

        commentReft.current.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <div className={classes.commentsSection}>
            <div className={classes.commentsPanel}>
                <div className={classes.commentsPanelHeader}>
                    <Typography component="h2" variant="subtitle1" className={classes.commentsListHeading}>
                        Comments
                    </Typography>
                </div>
                <div className={classes.commentsListBody}>
                    <div className={classes.commentsScroll}>
                        {(comments ?? []).length === 0 ? (
                            <Typography variant="body2" color="textSecondary" className={classes.commentsEmpty}>
                                No comments yet. Start the conversation below.
                            </Typography>
                        ) : (
                            (comments ?? []).map((c, i) => {
                                const { author, body } = splitCommentAuthorBody(c);
                                return (
                                    <Typography
                                        key={i}
                                        variant="body2"
                                        component="div"
                                        className={classes.commentItem}
                                    >
                                        <strong>{author}</strong>
                                        {author && body ? ': ' : ''}
                                        {body}
                                    </Typography>
                                );
                            })
                        )}
                        <div ref={commentReft} />
                    </div>
                </div>
                {user?.result?.name && (
                    <div className={classes.writeCommentBlock}>
                        <Typography variant="subtitle1" component="h3" className={classes.writeCommentHeading}>
                            Write a comment
                        </Typography>
                        <div className={classes.commentComposerStack}>
                            <TextField
                                className={classes.commentField}
                                fullWidth
                                rows={2}
                                margin="dense"
                                variant="outlined"
                                label="Your comment"
                                multiline
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                            />
                            <div className={classes.commentPostRow}>
                                <Button
                                    className={classes.commentPostButton}
                                    disabled={!comment}
                                    variant="contained"
                                    onClick={handleClick}
                                    color="primary"
                                    size="small"
                                >
                                    Post comment
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default CommentSection;
