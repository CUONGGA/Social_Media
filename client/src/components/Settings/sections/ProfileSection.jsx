import React from 'react';
import { Box, Typography, Button, Avatar } from '@material-ui/core';
import PersonIcon from '@material-ui/icons/Person';
import OpenInNewIcon from '@material-ui/icons/OpenInNew';
import { Link } from 'react-router-dom';
import { deepPurple } from '@material-ui/core/colors';
import { makeStyles } from '@material-ui/core/styles';

const useLocalStyles = makeStyles((theme) => ({
    profileCard: {
        display: 'flex',
        alignItems: 'center',
        gap: theme.spacing(2),
        padding: theme.spacing(2),
        borderRadius: 12,
        backgroundColor:
            theme.palette.type === 'dark'
                ? 'rgba(129, 140, 248, 0.08)'
                : 'rgba(57, 73, 171, 0.05)',
        marginBottom: theme.spacing(2),
    },
    avatar: {
        width: 56,
        height: 56,
        fontSize: '1.4rem',
        backgroundColor: deepPurple[500],
        color: theme.palette.getContrastText(deepPurple[500]),
    },
    info: {
        flex: 1,
        minWidth: 0,
    },
    name: {
        fontSize: '1.05rem',
        fontWeight: 700,
        color: theme.palette.text.primary,
    },
    email: {
        fontSize: '0.8125rem',
        color: theme.palette.text.secondary,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
    },
}));

/* Section "Hồ sơ" — không thực sự sửa hồ sơ tại đây (đã có dialog ở
   trang /users/:id). Chỉ hiển thị tóm tắt + nút deeplink → tránh nhân đôi
   form, giữ "1 chỗ duy nhất để sửa hồ sơ" theo nguyên tắc DRY UX. */
const ProfileSection = ({ classes, user }) => {
    const local = useLocalStyles();
    const result = user?.result || {};
    const userId = result._id;
    const profileHref = userId ? `/users/${userId}` : '/me';

    return (
        <Box>
            <Box className={classes.sectionHeader}>
                <Box className={classes.sectionIconBox}>
                    <PersonIcon />
                </Box>
                <Box>
                    <Typography className={classes.sectionTitle} component="h2">
                        Hồ sơ
                    </Typography>
                    <Typography className={classes.sectionDescription} component="p">
                        Thông tin hiển thị công khai trên trang cá nhân và các bài viết của bạn.
                    </Typography>
                </Box>
            </Box>

            <Box className={local.profileCard}>
                <Avatar className={local.avatar} src={result.picture || undefined}>
                    {result.name?.charAt(0)?.toUpperCase() || '?'}
                </Avatar>
                <Box className={local.info}>
                    <Typography className={local.name} component="div">
                        {result.name || 'Người dùng'}
                    </Typography>
                    {result.email && (
                        <Typography className={local.email} component="div" title={result.email}>
                            {result.email}
                        </Typography>
                    )}
                </Box>
            </Box>

            <Typography className={classes.suggestionIntro} component="p">
                Để sửa <strong>tên hiển thị</strong>, <strong>bio</strong> hoặc{' '}
                <strong>ảnh đại diện</strong>, hãy mở trang hồ sơ và bấm "Sửa hồ sơ".
            </Typography>

            <Button
                component={Link}
                to={profileHref}
                variant="contained"
                color="primary"
                disableElevation
                endIcon={<OpenInNewIcon />}
            >
                Mở trang hồ sơ
            </Button>
        </Box>
    );
};

export default ProfileSection;
