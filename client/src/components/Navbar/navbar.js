import React, { useState, useEffect, useRef } from "react";
import { Link, useHistory, useLocation } from "react-router-dom";
import {
    AppBar,
    Avatar,
    Toolbar,
    Typography,
    Button,
    IconButton,
    Menu,
    MenuItem,
    Divider,
} from "@material-ui/core";
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import NightsStay from '@material-ui/icons/NightsStay';
import WbSunny from '@material-ui/icons/WbSunny';
import PersonIcon from '@material-ui/icons/Person';
import SettingsIcon from '@material-ui/icons/Settings';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { useDispatch, useSelector } from "react-redux";
import { useThemeMode } from '../../context/ThemeModeContext';
import { jwtDecode } from 'jwt-decode';
import { notifyInfo } from '../../utils/notify';
import { getUserId } from '../../utils/authUser';
import useStyle from './styles';
import memoriesLogo from '../../images/memories-Logo.png';
import memoriesText from '../../images/memories-Text.png';

const Navbar = () => {
    const classes = useStyle();
    const { mode, toggleMode } = useThemeMode();
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('profile')));
    const [menuAnchor, setMenuAnchor] = useState(null);
    /* Giữ ref tới trigger để Menu neo theo nó. Dùng anchorEl state là đủ,
       nhưng ref cũng cho phép focus lại trigger khi đóng menu (a11y). */
    const triggerRef = useRef(null);
    const dispatch = useDispatch();
    const history = useHistory();
    const location = useLocation();
    /* Subscribe authData để re-render khi profile được sửa qua dialog
       (PROF-5). Trước đây Navbar chỉ re-đọc localStorage khi location đổi,
       nên sau khi sửa hồ sơ ngay tại trang /users/:id, avatar/tên vẫn cũ
       cho tới khi user navigate. Dispatch AUTH trong thunk → authData đổi
       → useEffect bên dưới chạy lại → setUser từ localStorage. */
    const authData = useSelector((state) => state.auth?.authData);

    const closeMenu = () => setMenuAnchor(null);

    const logout = () => {
        closeMenu();
        dispatch({ type: 'LOGOUT' });
        notifyInfo('You have been signed out.');
        history.push('/');
        setUser(null);
    };

    /* Toggle mode trong menu: chỉ đổi theme, KHÔNG đóng menu.
       Lý do giữ menu mở: user có thể muốn xem trước cả 2 chế độ ngay tại chỗ,
       hoặc đổi rồi mới quyết logout/giữ. Đóng menu = phá luồng. Người dùng
       muốn đóng → click ngoài / Esc / click lại trigger. */
    const handleToggleMode = (e) => {
        /* `stopPropagation` để Menu không nhầm rằng user click ra ngoài
           rồi tự đóng. Một số bản MUI v4 vẫn đóng nếu không stop. */
        e.stopPropagation();
        toggleMode();
    };

    const goToProfile = () => {
        closeMenu();
        const uid = getUserId(user);
        /* Nếu user OAuth Google chưa có document trong DB → uid có thể là `sub`
           string. Server sẽ 404 và Profile page hiển thị empty state phù hợp. */
        if (uid) history.push(`/users/${uid}`);
        else history.push('/me'); /* fallback: route /me sẽ tự redirect /auth */
    };

    /* Mở trang Cài đặt: đóng Menu trước rồi navigate. Trang Settings có
       sidebar nhiều mục, deeplink theo /settings/:section (mặc định security).
       Không còn dùng Dialog vì user yêu cầu page riêng cho dễ mở rộng nhiều
       section sau này. */
    const openSettings = () => {
        closeMenu();
        history.push('/settings');
    };

    /* User đăng nhập bằng Google sẽ KHÔNG có `password` field trong document
       (xem `googleSignIn` controller: `User.create({ name, email, googleId, picture })`
       không set password). Dùng để chọn mô tả phụ trong MenuItem. */
    const hasLocalPassword = Boolean(user?.result?.password);

    /* Back button: chỉ hiện trên các trang con (không Home, không root, không Auth).
       `history.goBack()` an toàn nếu đã có navigation trước đó trong session;
       fallback về `/posts` nếu user mở trang trực tiếp (vd paste URL).

       Heuristic: dùng `window.history.length > 2` để đoán có history hay không.
       Không hoàn hảo (browser history.length đếm cả các tab/page khác) nhưng
       đủ tốt cho 90% case. Edge case còn lại: user vào thẳng `/users/:id` →
       click back → đi về `/posts`. */
    const isOnHome = location.pathname === '/' || location.pathname === '/posts';
    const isOnAuth = location.pathname === '/auth';
    const showBack = !isOnHome && !isOnAuth;

    const handleBack = () => {
        if (window.history.length > 2) history.goBack();
        else history.push('/posts');
    };

    useEffect(() => {
        const token = user?.token;
        if (token) {
            const decodedToken = jwtDecode(token);
            if (decodedToken.exp * 1000 < new Date().getTime()) logout();
        }
        setUser(JSON.parse(localStorage.getItem('profile')));
        /* eslint-disable-next-line react-hooks/exhaustive-deps */
    }, [location, authData]);

    const nextModeLabel = mode === 'light' ? 'Dark mode' : 'Light mode';
    const ModeIcon = mode === 'light' ? NightsStay : WbSunny;

    return (
        <AppBar className={classes.appBar} position="static" color='inherit' elevation={0}>
            <div className={classes.leftSide}>
                {showBack && (
                    <IconButton
                        className={classes.backBtn}
                        onClick={handleBack}
                        aria-label="Quay lại"
                    >
                        <ArrowBackIcon fontSize="large" />
                    </IconButton>
                )}
                <Link to="/" className={classes.brandContainer}>
                    <img src={memoriesText} alt="icon" height="55px" />
                    <img className={classes.image} src={memoriesLogo} alt="icon" height="60px" />
                </Link>
            </div>
            <Toolbar className={classes.toolbar}>
                {user ? (
                    <>
                        {/* Trigger là chính Avatar của user — kiểu Gmail / GitHub.
                            IconButton ngoài cho click + a11y + hover ring; bên trong
                            Avatar không có padding để tận dụng hết 40×40. */}
                        <IconButton
                            ref={triggerRef}
                            className={`${classes.avatarTrigger} ${menuAnchor ? classes.avatarTriggerActive : ''}`}
                            onClick={(e) => setMenuAnchor(e.currentTarget)}
                            aria-controls={menuAnchor ? 'profile-menu' : undefined}
                            aria-haspopup="true"
                            aria-expanded={menuAnchor ? 'true' : undefined}
                            aria-label="Open account menu"
                        >
                            <Avatar
                                className={`${classes.purple} ${classes.avatarTriggerImg}`}
                                alt={user?.result?.name?.charAt(0)}
                                src={user?.result?.picture}
                            >
                                {user?.result?.name?.charAt(0)}
                            </Avatar>
                        </IconButton>

                        <Menu
                            id="profile-menu"
                            anchorEl={menuAnchor}
                            keepMounted
                            open={Boolean(menuAnchor)}
                            onClose={closeMenu}
                            getContentAnchorEl={null}
                            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                            classes={{ paper: classes.menuPaper, list: classes.menuList }}
                            TransitionProps={{ timeout: 180 }}
                        >
                            {/* Header card: avatar lớn + tên + email. Không clickable,
                                cho user "thấy mình là ai" trước khi chọn hành động. */}
                            <div className={classes.menuHeader}>
                                <Avatar
                                    className={`${classes.purple} ${classes.menuHeaderAvatar}`}
                                    alt={user?.result?.name?.charAt(0)}
                                    src={user?.result?.picture}
                                >
                                    {user?.result?.name?.charAt(0)}
                                </Avatar>
                                <div className={classes.menuHeaderText}>
                                    <Typography className={classes.menuHeaderName} component="div">
                                        {user?.result?.name}
                                    </Typography>
                                    {user?.result?.email && (
                                        <Typography className={classes.menuHeaderEmail} component="div">
                                            {user.result.email}
                                        </Typography>
                                    )}
                                </div>
                            </div>

                            <Divider className={classes.menuDivider} />

                            <MenuItem onClick={goToProfile} className={classes.menuItem}>
                                <div className={classes.menuItemIconBox}>
                                    <PersonIcon fontSize="small" />
                                </div>
                                <div className={classes.menuItemText}>
                                    <Typography className={classes.menuItemPrimary} component="div">
                                        Hồ sơ
                                    </Typography>
                                    <Typography className={classes.menuItemSecondary} component="div">
                                        Xem trang cá nhân & kỷ niệm
                                    </Typography>
                                </div>
                            </MenuItem>

                            <MenuItem onClick={openSettings} className={classes.menuItem}>
                                <div className={classes.menuItemIconBox}>
                                    <SettingsIcon fontSize="small" />
                                </div>
                                <div className={classes.menuItemText}>
                                    <Typography className={classes.menuItemPrimary} component="div">
                                        Cài đặt
                                    </Typography>
                                    <Typography className={classes.menuItemSecondary} component="div">
                                        {hasLocalPassword
                                            ? 'Đổi mật khẩu & tuỳ chỉnh tài khoản'
                                            : 'Tuỳ chỉnh tài khoản (đăng nhập Google)'}
                                    </Typography>
                                </div>
                            </MenuItem>

                            <MenuItem onClick={handleToggleMode} className={classes.menuItem}>
                                <div className={classes.menuItemIconBox}>
                                    <ModeIcon fontSize="small" />
                                </div>
                                <div className={classes.menuItemText}>
                                    <Typography className={classes.menuItemPrimary} component="div">
                                        {nextModeLabel}
                                    </Typography>
                                    <Typography className={classes.menuItemSecondary} component="div">
                                        {mode === 'light' ? 'Đang dùng giao diện sáng' : 'Đang dùng giao diện tối'}
                                    </Typography>
                                </div>
                            </MenuItem>

                            <Divider className={classes.menuDivider} />

                            <MenuItem
                                onClick={logout}
                                className={`${classes.menuItem} ${classes.menuItemDanger}`}
                            >
                                <div className={`${classes.menuItemIconBox} ${classes.menuItemIconBoxDanger}`}>
                                    <ExitToAppIcon fontSize="small" />
                                </div>
                                <div className={classes.menuItemText}>
                                    <Typography className={classes.menuItemPrimary} component="div">
                                        Logout
                                    </Typography>
                                    <Typography className={classes.menuItemSecondary} component="div">
                                        Đăng xuất khỏi tài khoản
                                    </Typography>
                                </div>
                            </MenuItem>
                        </Menu>
                    </>
                ) : (
                    /* Chưa đăng nhập: vẫn cần nút đổi theme độc lập (không có
                       chỗ "trong tài khoản" để giấu). Đặt cạnh nút Sign In. */
                    <>
                        <IconButton
                            className={classes.themeToggle}
                            onClick={toggleMode}
                            aria-label={`Switch to ${nextModeLabel.toLowerCase()}`}
                        >
                            <ModeIcon />
                        </IconButton>
                        <Button
                            component={Link}
                            to="/auth"
                            variant="contained"
                            color="primary"
                            className={classes.signInButton}
                            disableElevation
                        >
                            Sign In
                        </Button>
                    </>
                )}
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;
