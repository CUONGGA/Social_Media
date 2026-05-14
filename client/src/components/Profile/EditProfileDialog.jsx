import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    Typography,
    Avatar,
    Box,
} from '@material-ui/core';
import { useDispatch } from 'react-redux';
import { deepPurple } from '@material-ui/core/colors';
import { makeStyles } from '@material-ui/core/styles';

import { updateUserProfile } from '../../actions/users';

const NAME_MAX = 80;
const BIO_MAX = 280;
const PICTURE_MAX = 1024;

const useStyles = makeStyles((theme) => ({
    /* Đảm bảo dialog Paper KHÔNG kế thừa hover shadow toàn cục từ index.css */
    paper: {
        boxShadow: 'none !important',
        '&:hover': {
            boxShadow: 'none !important',
        },
    },
    avatarPreviewRow: {
        display: 'flex',
        alignItems: 'center',
        gap: theme.spacing(2),
        marginBottom: theme.spacing(1.5),
    },
    avatarPreview: {
        width: theme.spacing(8),
        height: theme.spacing(8),
        fontSize: '2rem',
        color: theme.palette.getContrastText(deepPurple[500]),
        backgroundColor: deepPurple[500],
    },
    avatarHint: {
        flex: 1,
    },
    helper: {
        marginTop: theme.spacing(-0.5),
        marginBottom: theme.spacing(0.5),
    },
    actions: {
        padding: theme.spacing(1.5, 3, 2),
    },
}));

/* Dialog sửa hồ sơ (PROF-5).

   Props:
   - open: boolean
   - onClose: () => void
   - userId: string (id của user đang sửa — luôn là chính chủ, ownership check ở server)
   - initial: { name, bio, picture } (giá trị hiện tại để pre-fill form)

   Hành vi:
   - Pre-fill form mỗi lần `open` chuyển từ false → true (đề phòng user mở rồi
     đóng → server đã đổi, mở lại phải lấy giá trị mới nhất).
   - Submit gọi thunk `updateUserProfile`; thành công → đóng dialog, fail giữ mở.
   - "Để trống ảnh URL" = xoá avatar về initial (chữ cái đầu). */
const EditProfileDialog = ({ open, onClose, userId, initial }) => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const [name, setName] = useState('');
    const [bio, setBio] = useState('');
    const [picture, setPicture] = useState('');
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (open) {
            setName(initial?.name || '');
            setBio(initial?.bio || '');
            setPicture(initial?.picture || '');
        }
    }, [open, initial]);

    const trimmedName = name.trim();
    const canSave = trimmedName.length > 0 && !saving;

    const handleClose = () => {
        if (saving) return;
        onClose();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!canSave) return;

        setSaving(true);
        const ok = await dispatch(
            updateUserProfile(userId, {
                name: trimmedName,
                bio,
                picture: picture.trim(),
            }),
        );
        setSaving(false);
        if (ok) onClose();
    };

    const previewInitial = trimmedName.charAt(0).toUpperCase() || '?';

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            fullWidth
            maxWidth="sm"
            PaperProps={{ className: classes.paper }}
        >
            <form onSubmit={handleSubmit} noValidate>
                <DialogTitle>Sửa hồ sơ</DialogTitle>
                <DialogContent dividers>
                    <Box className={classes.avatarPreviewRow}>
                        <Avatar
                            className={classes.avatarPreview}
                            src={picture.trim() || undefined}
                            alt={previewInitial}
                        >
                            {previewInitial}
                        </Avatar>
                        <Typography variant="body2" color="textSecondary" className={classes.avatarHint}>
                            Xem trước avatar. Để trống URL nếu muốn dùng chữ cái đầu của tên.
                        </Typography>
                    </Box>

                    <TextField
                        label="Tên hiển thị"
                        fullWidth
                        variant="outlined"
                        margin="dense"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        inputProps={{ maxLength: NAME_MAX }}
                        helperText={`${name.length}/${NAME_MAX}`}
                        required
                        autoFocus
                    />

                    <TextField
                        label="Bio"
                        fullWidth
                        variant="outlined"
                        margin="dense"
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        multiline
                        rows={3}
                        inputProps={{ maxLength: BIO_MAX }}
                        helperText={`${bio.length}/${BIO_MAX} · giới thiệu ngắn về bạn`}
                        placeholder="Một vài dòng về bạn…"
                    />

                    <TextField
                        label="URL ảnh đại diện"
                        fullWidth
                        variant="outlined"
                        margin="dense"
                        value={picture}
                        onChange={(e) => setPicture(e.target.value)}
                        placeholder="https://… (để trống để dùng chữ cái đầu)"
                        inputProps={{ maxLength: PICTURE_MAX }}
                        helperText="Dán link ảnh trực tiếp (jpg/png/webp). Sẽ thay đổi avatar ngay."
                    />
                </DialogContent>
                <DialogActions className={classes.actions}>
                    <Button onClick={handleClose} disabled={saving}>
                        Huỷ
                    </Button>
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        disabled={!canSave}
                        disableElevation
                    >
                        {saving ? 'Đang lưu…' : 'Lưu'}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};

export default EditProfileDialog;
