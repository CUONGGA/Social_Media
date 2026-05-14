import React from 'react';
import { Box, Typography, Button } from '@material-ui/core';
import PaletteIcon from '@material-ui/icons/Palette';
import NightsStay from '@material-ui/icons/NightsStay';
import WbSunny from '@material-ui/icons/WbSunny';
import { useThemeMode } from '../../../context/ThemeModeContext';

/* Section "Giao diện" — hiện duy nhất 1 option (Theme). Có thể mở rộng:
   accent color, font scale, density (compact/comfortable)… Mỗi option =
   1 `<Box className={classes.optionRow}>` mới. */
const AppearanceSection = ({ classes }) => {
    const { mode, setMode } = useThemeMode();

    return (
        <Box>
            <Box className={classes.sectionHeader}>
                <Box className={classes.sectionIconBox}>
                    <PaletteIcon />
                </Box>
                <Box>
                    <Typography className={classes.sectionTitle} component="h2">
                        Giao diện
                    </Typography>
                    <Typography className={classes.sectionDescription} component="p">
                        Tuỳ chỉnh theme và cảm giác chung của ứng dụng.
                    </Typography>
                </Box>
            </Box>

            <Box>
                <Box className={classes.optionRow}>
                    <Box>
                        <Typography className={classes.optionLabel} component="div">
                            Chế độ màu
                        </Typography>
                        <Typography className={classes.optionHint} component="div">
                            {mode === 'dark'
                                ? 'Đang dùng giao diện tối — dễ chịu vào ban đêm.'
                                : 'Đang dùng giao diện sáng — rõ nét vào ban ngày.'}
                        </Typography>
                    </Box>
                    {/* 2 nút side-by-side, nút "active" outlined nhạt (vì đã chọn rồi),
                        nút "inactive" outlined nổi hơn (call-to-action). Cách này
                        rõ hơn 1 toggle switch — user thấy ngay 2 lựa chọn. */}
                    <Box style={{ display: 'flex', gap: 8 }}>
                        <Button
                            variant={mode === 'light' ? 'contained' : 'outlined'}
                            color={mode === 'light' ? 'primary' : 'default'}
                            startIcon={<WbSunny />}
                            onClick={() => setMode('light')}
                            disableElevation
                            size="small"
                        >
                            Sáng
                        </Button>
                        <Button
                            variant={mode === 'dark' ? 'contained' : 'outlined'}
                            color={mode === 'dark' ? 'primary' : 'default'}
                            startIcon={<NightsStay />}
                            onClick={() => setMode('dark')}
                            disableElevation
                            size="small"
                        >
                            Tối
                        </Button>
                    </Box>
                </Box>

                <Box className={classes.optionRow}>
                    <Box>
                        <Typography className={classes.optionLabel} component="div">
                            Tự động theo hệ thống
                            <span className={classes.comingSoonPill}>Sắp ra mắt</span>
                        </Typography>
                        <Typography className={classes.optionHint} component="div">
                            Đổi sáng/tối theo cài đặt OS (`prefers-color-scheme`). Hiện chưa bật
                            — phải chọn thủ công.
                        </Typography>
                    </Box>
                </Box>

                <Box className={classes.optionRow}>
                    <Box>
                        <Typography className={classes.optionLabel} component="div">
                            Cỡ chữ & mật độ
                            <span className={classes.comingSoonPill}>Sắp ra mắt</span>
                        </Typography>
                        <Typography className={classes.optionHint} component="div">
                            Nhỏ / vừa / lớn cho người dùng cần dễ đọc. Mật độ compact /
                            comfortable cho người dùng cần xem nhiều bài hơn trên 1 màn hình.
                        </Typography>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};

export default AppearanceSection;
