import React, { useMemo } from 'react';
import { Redirect, useHistory, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Box, Paper, Typography } from '@material-ui/core';
import LockIcon from '@material-ui/icons/Lock';
import PaletteIcon from '@material-ui/icons/Palette';
import PersonIcon from '@material-ui/icons/Person';
import NotificationsIcon from '@material-ui/icons/Notifications';
import SecurityIcon from '@material-ui/icons/Security';
import LanguageIcon from '@material-ui/icons/Language';
import StorageIcon from '@material-ui/icons/Storage';

import useStyle from './styles';
import SecuritySection from './sections/SecuritySection';
import AppearanceSection from './sections/AppearanceSection';
import ProfileSection from './sections/ProfileSection';
import ComingSoonSection from './sections/ComingSoonSection';

/* === Cấu hình section ===
   Mỗi item:
   - slug: dùng cho URL /settings/:slug (deeplink).
   - label: hiển thị trong sidebar + section title (nếu reused).
   - icon: component để render (KHÔNG instantiate ở đây — bên dưới khi render
     sẽ `<Icon />`).
   - status: 'active' | 'partial' | 'soon'
       active  → tính năng hoạt động đầy đủ (Bảo mật, Giao diện).
       partial → có UI nhưng dẫn ra chỗ khác (Hồ sơ — sửa ở trang /users/:id).
       soon    → placeholder, hiển thị danh sách gợi ý.
   - suggestions: chỉ dùng cho status='soon', list các feature dự kiến.

   Thứ tự: đặt mục "active" ở đầu để mặc định landing đúng feature dùng được. */
const SECTIONS = [
    {
        slug: 'security',
        label: 'Bảo mật',
        icon: LockIcon,
        status: 'active',
    },
    {
        slug: 'profile',
        label: 'Hồ sơ',
        icon: PersonIcon,
        status: 'partial',
    },
    {
        slug: 'appearance',
        label: 'Giao diện',
        icon: PaletteIcon,
        status: 'active',
    },
    {
        slug: 'notifications',
        label: 'Thông báo',
        icon: NotificationsIcon,
        status: 'soon',
        description:
            'Nhận thông báo khi bài viết của bạn được tương tác hoặc có hoạt động mới từ người bạn theo dõi.',
        suggestions: [
            {
                label: 'Chuông thông báo realtime',
                hint: 'Báo ngay khi bài bạn bị like / comment (SSE per-user, đề xuất A2).',
            },
            {
                label: 'Email tổng hợp hằng tuần',
                hint: 'Tóm tắt các kỷ niệm phổ biến + tương tác bạn nhận được.',
            },
            {
                label: 'Tắt thông báo theo loại',
                hint: 'Bật/tắt riêng like, comment, follow, mention.',
            },
            {
                label: 'Yên lặng khoảng thời gian',
                hint: 'Không nhận thông báo từ 22:00 — 7:00 (do not disturb).',
            },
        ],
    },
    {
        slug: 'privacy',
        label: 'Quyền riêng tư',
        icon: SecurityIcon,
        status: 'soon',
        description:
            'Quyết định ai có thể xem, bình luận và tương tác với bài viết của bạn.',
        suggestions: [
            {
                label: 'Mặc định công khai / chỉ mình',
                hint: 'Đặt trạng thái mặc định cho bài đăng mới (public / private / followers-only).',
            },
            {
                label: 'Ai được bình luận',
                hint: 'Tất cả mọi người, chỉ người đăng nhập, hoặc chỉ người bạn theo dõi.',
            },
            {
                label: 'Khoá / chặn người dùng',
                hint: 'Chặn 1 user không tương tác được với bài và hồ sơ của bạn.',
            },
            {
                label: 'Ẩn email khỏi hồ sơ công khai',
                hint: 'Hiện tại không lộ email — sẽ cho phép user "tag" trong tương lai.',
            },
            {
                label: 'Lịch sử đăng nhập',
                hint: 'Xem danh sách thiết bị + IP đã đăng nhập (cần phía sau lưu session log).',
            },
        ],
    },
    {
        slug: 'language',
        label: 'Ngôn ngữ & vùng',
        icon: LanguageIcon,
        status: 'soon',
        description:
            'Chọn ngôn ngữ giao diện và định dạng ngày tháng phù hợp với vùng của bạn.',
        suggestions: [
            {
                label: 'Ngôn ngữ giao diện',
                hint: 'Tiếng Việt / English (i18n bằng react-intl hoặc i18next).',
            },
            {
                label: 'Múi giờ',
                hint: 'Tự phát hiện từ trình duyệt + cho phép override (UTC+7, UTC+0…).',
            },
            {
                label: 'Định dạng ngày tháng',
                hint: 'dd/mm/yyyy / mm/dd/yyyy / yyyy-mm-dd. Áp cho mọi nơi hiển thị thời gian.',
            },
            {
                label: 'Tuần bắt đầu từ Thứ hai / Chủ nhật',
                hint: 'Liên quan tới tính năng Timeline / "On this day" trong tương lai.',
            },
        ],
    },
    {
        slug: 'data',
        label: 'Dữ liệu & tài khoản',
        icon: StorageIcon,
        status: 'soon',
        description:
            'Xuất, nhập dữ liệu cá nhân hoặc xoá tài khoản hoàn toàn khỏi hệ thống.',
        suggestions: [
            {
                label: 'Xuất dữ liệu của tôi',
                hint: 'Tải file JSON / ZIP chứa toàn bộ bài viết, bình luận, like, hồ sơ. Tuân thủ GDPR.',
            },
            {
                label: 'Đăng xuất khỏi mọi thiết bị',
                hint: 'Invalidate hết JWT đang dùng. Cần token blocklist (SET-4 trong backlog).',
            },
            {
                label: 'Tạm khoá tài khoản',
                hint: 'Ẩn hồ sơ + bài viết khỏi public, có thể bật lại sau (soft-disable).',
            },
            {
                label: 'Xoá tài khoản vĩnh viễn',
                hint: 'Xoá toàn bộ document User + bài + comment. Cần xác nhận 2 lần + delay 7 ngày để rollback.',
            },
            {
                label: 'Liên kết tài khoản',
                hint: 'Liên kết / huỷ liên kết Google, GitHub, Facebook... với tài khoản local.',
            },
        ],
    },
];

const Settings = () => {
    const classes = useStyle();
    const history = useHistory();
    const { section } = useParams();

    /* Auth guard: nếu chưa login → /auth.
       Đọc localStorage 1 lần ở mount. Subscribe authData để re-eval khi
       user đăng xuất ở tab khác (đề phòng). */
    const authData = useSelector((state) => state.auth?.authData);
    const user = useMemo(() => {
        try {
            return JSON.parse(localStorage.getItem('profile'));
        } catch {
            return null;
        }
        /* eslint-disable-next-line react-hooks/exhaustive-deps */
    }, [authData]);

    if (!user?.result) {
        return <Redirect to="/auth" />;
    }

    /* Section mặc định = `security` (active đầu tiên). Nếu slug từ URL không
       hợp lệ → cũng redirect về default thay vì hiện trắng. */
    const activeSlug = section && SECTIONS.find((s) => s.slug === section)?.slug;
    if (!activeSlug) {
        return <Redirect to="/settings/security" />;
    }

    const active = SECTIONS.find((s) => s.slug === activeSlug);

    const hasLocalPassword = Boolean(user.result.password);

    const renderActive = () => {
        switch (active.slug) {
            case 'security':
                return (
                    <SecuritySection
                        classes={classes}
                        hasLocalPassword={hasLocalPassword}
                    />
                );
            case 'appearance':
                return <AppearanceSection classes={classes} />;
            case 'profile':
                return <ProfileSection classes={classes} user={user} />;
            default:
                /* status='soon' → ComingSoonSection. Truyền icon đã instantiate. */
                return (
                    <ComingSoonSection
                        classes={classes}
                        icon={<active.icon />}
                        title={active.label}
                        description={active.description}
                        suggestions={active.suggestions}
                    />
                );
        }
    };

    return (
        <Box>
            <Box className={classes.pageHeader}>
                <Box>
                    <Typography className={classes.pageTitle} component="h1">
                        Cài đặt
                    </Typography>
                    <Typography className={classes.pageSubtitle} component="div">
                        Tuỳ chỉnh tài khoản, bảo mật, và trải nghiệm sử dụng.
                    </Typography>
                </Box>
            </Box>

            <Box className={classes.page}>
                {/* SIDEBAR */}
                <Paper elevation={0} className={classes.sidebar}>
                    <Box className={classes.sidebarList}>
                        {SECTIONS.map((s) => {
                            const Icon = s.icon;
                            const isActive = s.slug === active.slug;
                            return (
                                <Box
                                    key={s.slug}
                                    className={`${classes.sidebarItem} ${
                                        isActive ? classes.sidebarItemActive : ''
                                    }`}
                                    onClick={() => history.push(`/settings/${s.slug}`)}
                                    role="button"
                                    tabIndex={0}
                                    onKeyDown={(e) => {
                                        /* a11y: Enter / Space cũng kích hoạt như click. */
                                        if (e.key === 'Enter' || e.key === ' ') {
                                            e.preventDefault();
                                            history.push(`/settings/${s.slug}`);
                                        }
                                    }}
                                >
                                    <Box
                                        className={`${classes.sidebarIconBox} ${
                                            isActive ? classes.sidebarIconBoxActive : ''
                                        }`}
                                    >
                                        <Icon fontSize="small" />
                                    </Box>
                                    <Typography
                                        className={classes.sidebarLabel}
                                        component="span"
                                    >
                                        {s.label}
                                    </Typography>
                                    {s.status === 'soon' && (
                                        <span className={classes.sidebarBadge}>Sắp ra mắt</span>
                                    )}
                                </Box>
                            );
                        })}
                    </Box>
                </Paper>

                {/* CONTENT */}
                <Box className={classes.content}>
                    <Paper elevation={0} className={classes.contentPaper}>
                        {renderActive()}
                    </Paper>
                </Box>
            </Box>
        </Box>
    );
};

export default Settings;
