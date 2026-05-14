import React, { useEffect, useMemo, useState } from 'react';
import { useParams, useHistory, Redirect } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
    Paper,
    Avatar,
    Typography,
    Button,
    Divider,
    Grid,
    CircularProgress,
} from '@material-ui/core';
import { Pagination } from '@material-ui/lab';
import EditIcon from '@material-ui/icons/Edit';
import moment from 'moment';

import { getUserProfile, getUserPostsPage } from '../../actions/users';
import { readStoredProfile, getUserId } from '../../utils/authUser';
import Post from '../Posts/Post/post';
import EditProfileDialog from './EditProfileDialog';
import useStyles from './styles';

/* Trang hồ sơ (Phạm vi S — MVP):
   - Header: avatar lớn + tên + ngày tham gia + số bài
   - Nếu là chính mình → nút "Sửa hồ sơ" (chưa hoạt động, stub cho Phạm vi M)
   - Grid bài viết + pagination
*/
const Profile = () => {
    const { id } = useParams();
    const history = useHistory();
    const dispatch = useDispatch();
    const classes = useStyles();

    const { viewed, posts, currentPage, numberOfPages, isLoading } = useSelector(
        (state) => state.profile,
    );

    /* Xác định "có phải mình không" để hiển thị nút Sửa hồ sơ.
       Đọc trực tiếp localStorage (không qua Redux auth) vì auth context
       hiện tại không nhất quán; util `authUser` đã chuẩn hoá. */
    const myUserId = useMemo(() => getUserId(readStoredProfile()), []);
    const isOwner = myUserId && String(myUserId) === String(id);
    const [editOpen, setEditOpen] = useState(false);

    useEffect(() => {
        if (!id) return;
        dispatch(getUserProfile(id, 1));
    }, [id, dispatch]);

    const handlePageChange = (_e, nextPage) => {
        if (!nextPage || nextPage === currentPage) return;
        dispatch(getUserPostsPage(id, nextPage));
    };

    /* Trường hợp `/me` được sử dụng nhưng chưa login → đẩy về signin. */
    if (id === '__me_placeholder__') {
        return myUserId ? <Redirect to={`/users/${myUserId}`} /> : <Redirect to="/auth" />;
    }

    /* Loading: bài đầu chưa về. Hiển thị spinner toàn trang. */
    if (isLoading && !viewed) {
        return (
            <Paper elevation={6} className={classes.loadingPaper}>
                <CircularProgress size="6em" />
            </Paper>
        );
    }

    /* User không tồn tại (server 404) → viewed vẫn null sau khi đã load xong. */
    if (!viewed && !isLoading) {
        return (
            <Paper elevation={6} className={classes.rootPaper}>
                <Typography variant="h6">Không tìm thấy người dùng này.</Typography>
                <Typography variant="body2" color="textSecondary">
                    Có thể tài khoản đã bị xoá hoặc đăng nhập bằng Google chưa đồng bộ về local DB.
                </Typography>
                <Button onClick={() => history.push('/posts')} className={classes.backBtn}>
                    Về trang chính
                </Button>
            </Paper>
        );
    }

    const initial = viewed?.name?.charAt(0) || '?';
    const joinedText = viewed?.joinedAt
        ? `Ngày tham gia: ${moment(viewed.joinedAt).format('DD/MM/YYYY')}`
        : 'Ngày tham gia: trước đây';

    return (
        <div className={classes.wrapper}>
            <Paper elevation={0} className={classes.headerPaper}>
                <div className={classes.headerContent}>
                    <Avatar
                        className={`${classes.headerAvatar} ${classes.purple}`}
                        alt={initial}
                        src={viewed?.picture || undefined}
                    >
                        {initial}
                    </Avatar>

                    <div className={classes.headerInfo}>
                        <Typography variant="h4" component="h1" className={classes.headerName}>
                            {viewed?.name}
                        </Typography>
                        <div className={classes.headerMeta}>
                            <Typography variant="body2" component="span" className={classes.headerMetaItem}>
                                {joinedText}
                            </Typography>
                            <span className={classes.metaDot} aria-hidden />
                            <Typography variant="body2" component="span" className={classes.headerMetaItem}>
                                {viewed?.postCount ?? 0} kỷ niệm
                            </Typography>
                            {/* Bỏ chip "Hồ sơ tạm" / "Chưa đồng bộ" — rò rỉ chi tiết kỹ
                                thuật ra UI. Server vẫn trả `source`, client vẫn dùng để
                                dựng synthetic profile khi 404 + self. */}
                        </div>
                        {viewed?.bio && (
                            <Typography variant="body2" component="p" className={classes.headerBio}>
                                {viewed.bio}
                            </Typography>
                        )}
                    </div>

                    {isOwner && (
                        <Button
                            variant="outlined"
                            startIcon={<EditIcon fontSize="small" />}
                            className={classes.editBtn}
                            onClick={() => setEditOpen(true)}
                        >
                            Sửa hồ sơ
                        </Button>
                    )}
                </div>
            </Paper>

            {isOwner && (
                <EditProfileDialog
                    open={editOpen}
                    onClose={() => setEditOpen(false)}
                    userId={String(id)}
                    initial={{
                        name: viewed?.name || '',
                        bio: viewed?.bio || '',
                        picture: viewed?.picture || '',
                    }}
                />
            )}

            <Paper elevation={0} className={classes.postsPaper}>
                <Typography variant="h5" component="h2" className={classes.sectionTitle}>
                    Kỷ niệm của {viewed?.name}
                </Typography>
                <Divider className={classes.sectionDivider} />

                {posts.length === 0 ? (
                    <div className={classes.emptyState}>
                        <Typography variant="body2" color="textSecondary" className={classes.emptyText}>
                            {isOwner
                                ? 'Bạn chưa có kỷ niệm nào. Hãy đăng bài đầu tiên!'
                                : 'Người này chưa đăng kỷ niệm nào.'}
                        </Typography>
                        {isOwner && (
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={() => history.push('/posts')}
                                className={classes.emptyCta}
                                disableElevation
                            >
                                Tới trang đăng bài
                            </Button>
                        )}
                    </div>
                ) : (
                    <>
                        <Grid container alignItems="stretch" spacing={3} className={classes.postsGrid}>
                            {posts.map((post) => (
                                <Grid key={post._id} item xs={12} sm={6} md={4}>
                                    {/* Reuse Post card. setCurrentId = no-op vì Profile
                                        không có Form edit ngay tại đây. `hideEdit` để
                                        không hiển thị nút "..." (vô tác dụng trên trang
                                        này). Delete vẫn giữ. */}
                                    <Post post={post} setCurrentId={() => {}} hideEdit />
                                </Grid>
                            ))}
                        </Grid>

                        {numberOfPages > 1 && (
                            <div className={classes.paginationWrap}>
                                <Pagination
                                    count={numberOfPages}
                                    page={currentPage}
                                    variant="outlined"
                                    color="primary"
                                    boundaryCount={1}
                                    siblingCount={1}
                                    onChange={handlePageChange}
                                />
                            </div>
                        )}
                    </>
                )}
            </Paper>
        </div>
    );
};

export default Profile;
