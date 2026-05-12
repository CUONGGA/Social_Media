import React, { useEffect, useState, useCallback } from 'react';
import { Paper, Typography, CircularProgress, Divider, Chip } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import CommentSection from './commentsection.jsx';
import { useParams, useHistory } from 'react-router-dom';
import { getPost, getPostBySearch } from '../../actions/posts.js';
import useStyle from './styles';
import { intrinsicDisplaySize } from './intrinsicImageSize';

const fallbackImg =
  'https://user-images.githubusercontent.com/194400/49531010-48dad180-f8b1-11e8-8d89-1e61320e1d82.png';

function getCaps() {
  if (typeof window === 'undefined') return { capW: 480, capH: 720 };
  const vw = window.innerWidth;
  const small = vw < 600;
  return {
    capW: small ? Math.min(360, vw - 48) : 480,
    capH: small ? 420 : 720,
  };
}

const PostDetails = () => {
    const { post, posts, isLoading } = useSelector((state) => state.posts);
    const dispatch = useDispatch();
    const history = useHistory();
    const classes = useStyle();
    const { id } = useParams();

    const [mainNatural, setMainNatural] = useState(null);
    const [mainDisplay, setMainDisplay] = useState(null);

    const applyMainSize = useCallback((nw, nh) => {
      const { capW, capH } = getCaps();
      setMainDisplay(intrinsicDisplaySize(nw, nh, capW, capH));
    }, []);

    useEffect(() => {
        dispatch(getPost(id));
    }, [id, dispatch]);

    useEffect(() => {
        if (!post || String(post._id) !== String(id)) return;
        dispatch(
            getPostBySearch({ search: 'none', tags: (post.tags ?? []).join(',') }, { silent: true })
        );
    }, [post, id, dispatch]);

    useEffect(() => {
      setMainNatural(null);
      setMainDisplay(null);
    }, [post?._id, post?.selectedFile]);

    useEffect(() => {
      if (!mainNatural) return undefined;
      const onResize = () => applyMainSize(mainNatural.w, mainNatural.h);
      window.addEventListener('resize', onResize);
      return () => window.removeEventListener('resize', onResize);
    }, [mainNatural, applyMainSize]);

    const postReady = post && String(post._id) === String(id);

    if (isLoading && !postReady) {
      return (
        <Paper elevation={6} className={classes.loadingPaper}>
                <CircularProgress size="7em" />
            </Paper>
        );
      }

    if (!postReady) {
      return (
        <Paper elevation={6} className={classes.rootPaper}>
          <Typography variant="h6">Không tải được bài viết hoặc bài không tồn tại.</Typography>
        </Paper>
      );
    }

    const list = Array.isArray(posts) ? posts : [];
    const recommendedPosts = list.filter(({ _id }) => String(_id) !== String(post._id));

    const openPost = (_id) => history.push(`/posts/${_id}`);

    const { capH } = getCaps();
    const mainImgStyle = mainDisplay
      ? {
          width: mainDisplay.width,
          height: mainDisplay.height,
          maxWidth: '100%',
        }
      : {
          maxWidth: '100%',
          maxHeight: capH > 500 ? 440 : 320,
        };

    const onMainImgLoad = (e) => {
      const { naturalWidth, naturalHeight } = e.currentTarget;
      if (!naturalWidth || !naturalHeight) return;
      setMainNatural({ w: naturalWidth, h: naturalHeight });
      applyMainSize(naturalWidth, naturalHeight);
    };

  return (
    <Paper className={classes.rootPaper} elevation={6}>
      <div className={classes.card}>
        <div className={classes.section}>
          <div className={classes.articleContent}>
            <Typography variant="h4" component="h1" className={classes.postTitle}>
              {post.title}
            </Typography>
            {(post.tags ?? []).length > 0 && (
              <div className={classes.tagRow} aria-label="Tags">
                {(post.tags ?? []).map((tag) => (
                  <Chip
                    key={tag}
                    size="small"
                    label={`#${tag}`}
                    className={classes.tagChip}
                    component="span"
                  />
                ))}
              </div>
            )}
            <Typography variant="body1" component="div" className={classes.postBody}>
              {post.message}
            </Typography>
            <div className={classes.postMeta}>
              <Typography variant="body2" component="span" className={classes.postAuthor}>
                {post.name}
              </Typography>
              <span className={classes.metaDot} aria-hidden />
              <Typography variant="caption" color="textSecondary" component="span">
                {moment(post.createdAt).fromNow()}
              </Typography>
            </div>
          </div>
          <Divider className={classes.sectionDivider} />
          <CommentSection post={post} />
          <Divider className={classes.sectionDivider} />
        </div>
        <div className={classes.imageSection}>
          <div className={classes.mediaFrame}>
            <img
              className={classes.media}
              src={post.selectedFile || fallbackImg}
              alt={post.title}
              onLoad={onMainImgLoad}
              style={mainImgStyle}
            />
          </div>
        </div>
      </div>
      {recommendedPosts.length > 0 && (
        <div className={classes.section}>
          <Typography gutterBottom variant="h5">You might also like:</Typography>
          <Divider />
          <div className={classes.recommendedPosts}>
            {recommendedPosts.map(({ title, name, message, likes, selectedFile, _id }) => (
              <div
                className={classes.recommendedCard}
                onClick={() => openPost(_id)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') openPost(_id);
                }}
                key={_id}
              >
                <Typography gutterBottom variant="h6">{title}</Typography>
                <Typography gutterBottom variant="subtitle2">{name}</Typography>
                <Typography gutterBottom variant="subtitle2" className={classes.recommendedMessage}>
                  {message}
                </Typography>
                <Typography gutterBottom variant="subtitle1">
                  Likes: {(likes ?? []).length}
                </Typography>
                <img
                  className={classes.recommendedMedia}
                  src={selectedFile || fallbackImg}
                  alt=""
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </Paper>
  )
}

export default PostDetails;
