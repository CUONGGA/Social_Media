import React from 'react';
import { Box, Typography } from '@material-ui/core';

/* Section dùng chung cho mọi feature chưa làm. Truyền vào:
   - icon: ReactNode (Material-UI icon component instance).
   - title: tên hiển thị (vd "Thông báo").
   - description: 1-2 câu mô tả tổng quát.
   - suggestions: array of {label, hint?} — danh sách gợi ý feature sẽ có trong section.
     `label` là tên feature (in đậm), `hint` là mô tả ngắn (italic xám). */
const ComingSoonSection = ({ classes, icon, title, description, suggestions }) => {
    return (
        <Box>
            <Box className={classes.sectionHeader}>
                <Box className={classes.sectionIconBox}>{icon}</Box>
                <Box>
                    <Typography className={classes.sectionTitle} component="h2">
                        {title}
                        <span className={classes.comingSoonPill}>Sắp ra mắt</span>
                    </Typography>
                    <Typography className={classes.sectionDescription} component="p">
                        {description}
                    </Typography>
                </Box>
            </Box>

            <Typography className={classes.suggestionIntro} component="p">
                Gợi ý các tính năng sẽ có trong mục này:
            </Typography>

            <ul className={classes.suggestionList}>
                {suggestions.map((s, i) => (
                    <li key={i}>
                        <strong>{s.label}</strong>
                        {s.hint && (
                            <>
                                {' — '}
                                <em>{s.hint}</em>
                            </>
                        )}
                    </li>
                ))}
            </ul>
        </Box>
    );
};

export default ComingSoonSection;
