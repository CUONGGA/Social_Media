import React from 'react';
import { Card, CardActions, CardContent, CardMedia, Button, Typography, ButtonBase, Link as MuiLink, Tooltip } from '@material-ui/core/';
import ThumbUpAltIcon from '@material-ui/icons/ThumbUpAlt';
import DeleteIcon from '@material-ui/icons/Delete';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import ThumbUpAltOutlined from '@material-ui/icons/ThumbUpAltOutlined';
import { useDispatch } from 'react-redux';
import moment from 'moment';
import { useHistory } from 'react-router-dom';

import { likePost, deletePost } from '../../../actions/posts';
import { readStoredProfile, getUserId } from '../../../utils/authUser';
import useStyles from './styles';

const isSameId = (a, b) => String(a) === String(b);

/* `hideEdit`: ẩn nút "..." (MoreHorizIcon) ở góc trên-phải card. Mặc định
   false → Home vẫn hiện như cũ. Profile truyền true vì trang đó không có
   Form mount → click "..." sẽ không có hiệu lực (setCurrentId là no-op).
   Delete vẫn giữ — user có quyền xoá bài của mình từ Profile. */
const Post = ({ post, setCurrentId, hideEdit = false }) => {
  const user = readStoredProfile();
  const dispatch = useDispatch();
  const history = useHistory();
  const classes = useStyles();

  const userId = getUserId(user);
  const likes = post.likes ?? [];

  const handleLike = () => {
    dispatch(likePost(post._id));
  };

  const Likes = () => {
    if (likes.length > 0) {
      return likes.some((like) => isSameId(like, userId))
        ? (
          <><ThumbUpAltIcon fontSize="small" />&nbsp;{likes.length > 2 ? `You and ${likes.length - 1} others` : `${likes.length} like${likes.length > 1 ? 's' : ''}` }</>
        ) : (
          <><ThumbUpAltOutlined fontSize="small" />&nbsp;{likes.length} {likes.length === 1 ? 'Like' : 'Likes'}</>
        );
    }

    return <><ThumbUpAltOutlined fontSize="small" />&nbsp;Like</>;
  };

  const openPost = (e) => {
    // dispatch(getPost(post._id, history));

    history.push(`/posts/${post._id}`);
  };

  /* Click vào tên creator → tới Profile của họ. Phải chặn bubbling để
     không trigger `openPost` (bọc ngoài là ButtonBase cho cả card). */
  const openCreatorProfile = (e) => {
    e.stopPropagation();
    if (post?.creator) history.push(`/users/${post.creator}`);
  };

  return (
    <Card className={classes.card} raised elevation={6}>
      <ButtonBase
        component="span"
        name="test"
        className={classes.cardAction}
        onClick={openPost}
      >
        <CardMedia className={classes.media} image={post.selectedFile || 'https://user-images.githubusercontent.com/194400/49531010-48dad180-f8b1-11e8-8d89-1e61320e1d82.png'} title={post.title} />
        <div className={classes.overlay}>
          {/* MuiLink (component="span") để giữ structure không tạo nested <a>;
              ButtonBase ngoài đã là interactive root. */}
          <MuiLink
            component="span"
            variant="h6"
            color="inherit"
            underline="hover"
            onClick={openCreatorProfile}
            style={{ cursor: 'pointer', display: 'inline-block' }}
          >
            {post.name}
          </MuiLink>
          <Typography variant="body2">{moment(post.createdAt).fromNow()}</Typography>
        </div>
        {!hideEdit && isSameId(getUserId(user), post?.creator) && (
        <div className={classes.overlay2} name="edit">
          <Tooltip title="Edit" arrow>
            <Button
              onClick={(e) => {
                e.stopPropagation();
                setCurrentId(post._id);
              }}
              style={{ color: 'white' }}
              size="small"
              aria-label="Edit post"
            >
              <MoreHorizIcon fontSize="default" />
            </Button>
          </Tooltip>
        </div>
        )}
        <div className={classes.details}>
          <Typography variant="body2" color="textSecondary" component="h2">{(post.tags ?? []).map((tag) => `#${tag} `)}</Typography>
        </div>
        <Typography className={classes.title} gutterBottom variant="h5" component="h2">{post.title}</Typography>
        <CardContent className={classes.cardContent}>
          <Typography variant="body2" color="textSecondary" component="p">{(post.message ?? '').split(' ').splice(0, 20).join(' ')}...</Typography>
        </CardContent>
      </ButtonBase>
      <CardActions className={classes.cardActions}>
        <Button size="small" color="primary" disabled={!user?.result} onClick={handleLike}>
          <Likes />
        </Button>
        {(isSameId(getUserId(user), post?.creator)) && (
          <Button size="small" color="secondary" onClick={() => dispatch(deletePost(post._id))}>
            <DeleteIcon fontSize="small" /> &nbsp; Delete
          </Button>
        )}
      </CardActions>
    </Card>
  );
};

export default Post;