import React, { useState, useMemo } from 'react';
import {
    TextField,
    Button,
    Typography,
    Box,
    IconButton,
    InputAdornment,
} from '@material-ui/core';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import LockIcon from '@material-ui/icons/Lock';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import { useDispatch } from 'react-redux';

import { changePassword } from '../../../actions/users';

/* Đồng bộ với server (controllers/users.js). Đổi 1 nơi → nhớ đổi nốt. */
const PASSWORD_MIN = 6;

/* Section "Bảo mật" — chứa form đổi mật khẩu.

   Props:
   - hasLocalPassword: boolean — nếu false, render banner Google thay vì form.
     Caller (Settings.jsx) tính từ `localStorage.profile.result.password`.
   - classes: shared makeStyles object từ trang Settings (tránh tạo 2 stylesheet
     song song; sub-section dùng cùng visual vocabulary với page). */
const SecuritySection = ({ classes, hasLocalPassword }) => {
    const dispatch = useDispatch();

    const [current, setCurrent] = useState('');
    const [next, setNext] = useState('');
    const [confirm, setConfirm] = useState('');
    /* Show/hide riêng cho từng field — user có thể xem field "current" mà
       không lộ "new"/"confirm" → giảm shoulder-surfing. */
    const [showCurrent, setShowCurrent] = useState(false);
    const [showNext, setShowNext] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    /* Nếu localStorage `hasLocalPassword=true` nhưng server vẫn 400 NO_PASSWORD
       (dữ liệu bất nhất / user vừa unset password ở tab khác) — switch banner. */
    const [noPasswordOverride, setNoPasswordOverride] = useState(false);

    const showGoogleBranch = !hasLocalPassword || noPasswordOverride;

    /* Validation client-side: tạo message lỗi inline khi user đã nhập gì đó.
       Không "scream" lỗi ngay khi field rỗng. */
    const errors = useMemo(() => {
        const e = {};
        if (next && next.length < PASSWORD_MIN) {
            e.next = `Tối thiểu ${PASSWORD_MIN} ký tự`;
        }
        if (next && current && next === current) {
            e.next = 'Mật khẩu mới phải khác mật khẩu hiện tại';
        }
        if (confirm && next && confirm !== next) {
            e.confirm = 'Mật khẩu xác nhận không khớp';
        }
        return e;
    }, [current, next, confirm]);

    const canSubmit =
        !submitting &&
        current.length > 0 &&
        next.length >= PASSWORD_MIN &&
        confirm.length > 0 &&
        confirm === next &&
        next !== current;

    const resetForm = () => {
        setCurrent('');
        setNext('');
        setConfirm('');
        setShowCurrent(false);
        setShowNext(false);
        setShowConfirm(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!canSubmit) return;

        setSubmitting(true);
        const result = await dispatch(
            changePassword({
                currentPassword: current,
                newPassword: next,
                confirmPassword: confirm,
            }),
        );
        setSubmitting(false);

        if (result === true) {
            resetForm(); /* clear form sau khi đổi thành công */
        } else if (result?.code === 'NO_PASSWORD') {
            setNoPasswordOverride(true);
        }
        /* Mọi lỗi khác đã có toast từ thunk. */
    };

    return (
        <Box>
            <Box className={classes.sectionHeader}>
                <Box className={classes.sectionIconBox}>
                    <LockIcon />
                </Box>
                <Box>
                    <Typography className={classes.sectionTitle} component="h2">
                        Bảo mật
                    </Typography>
                    <Typography className={classes.sectionDescription} component="p">
                        Quản lý mật khẩu đăng nhập và bảo vệ tài khoản của bạn.
                    </Typography>
                </Box>
            </Box>

            {showGoogleBranch ? (
                <Box className={classes.banner}>
                    <InfoOutlinedIcon fontSize="small" className={classes.bannerIcon} />
                    <Typography className={classes.bannerText} component="div">
                        Bạn đăng nhập bằng <strong>Google</strong> nên tài khoản này không có mật
                        khẩu local. Để đổi mật khẩu, hãy vào{' '}
                        <a
                            href="https://myaccount.google.com/signinoptions/password"
                            target="_blank"
                            rel="noreferrer"
                        >
                            Google Account → Bảo mật → Mật khẩu
                        </a>
                        .
                    </Typography>
                </Box>
            ) : (
                <form onSubmit={handleSubmit} noValidate>
                    <Box className={classes.formStack}>
                        <TextField
                            label="Mật khẩu hiện tại"
                            variant="outlined"
                            margin="dense"
                            fullWidth
                            type={showCurrent ? 'text' : 'password'}
                            value={current}
                            onChange={(ev) => setCurrent(ev.target.value)}
                            autoComplete="current-password"
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            size="small"
                                            onClick={() => setShowCurrent((v) => !v)}
                                            aria-label={
                                                showCurrent ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'
                                            }
                                        >
                                            {showCurrent ? (
                                                <VisibilityOff fontSize="small" />
                                            ) : (
                                                <Visibility fontSize="small" />
                                            )}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />

                        <TextField
                            label="Mật khẩu mới"
                            variant="outlined"
                            margin="dense"
                            fullWidth
                            type={showNext ? 'text' : 'password'}
                            value={next}
                            onChange={(ev) => setNext(ev.target.value)}
                            autoComplete="new-password"
                            error={Boolean(errors.next)}
                            helperText={errors.next || `Tối thiểu ${PASSWORD_MIN} ký tự`}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            size="small"
                                            onClick={() => setShowNext((v) => !v)}
                                            aria-label={
                                                showNext ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'
                                            }
                                        >
                                            {showNext ? (
                                                <VisibilityOff fontSize="small" />
                                            ) : (
                                                <Visibility fontSize="small" />
                                            )}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />

                        <TextField
                            label="Xác nhận mật khẩu mới"
                            variant="outlined"
                            margin="dense"
                            fullWidth
                            type={showConfirm ? 'text' : 'password'}
                            value={confirm}
                            onChange={(ev) => setConfirm(ev.target.value)}
                            autoComplete="new-password"
                            error={Boolean(errors.confirm)}
                            helperText={errors.confirm || ' '}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            size="small"
                                            onClick={() => setShowConfirm((v) => !v)}
                                            aria-label={
                                                showConfirm ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'
                                            }
                                        >
                                            {showConfirm ? (
                                                <VisibilityOff fontSize="small" />
                                            ) : (
                                                <Visibility fontSize="small" />
                                            )}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />

                        <Box className={classes.submitRow}>
                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                disabled={!canSubmit}
                                disableElevation
                            >
                                {submitting ? 'Đang lưu…' : 'Đổi mật khẩu'}
                            </Button>
                        </Box>
                    </Box>
                </form>
            )}
        </Box>
    );
};

export default SecuritySection;
