import { makeStyles } from '@material-ui/core/styles';

export default makeStyles((theme) => ({
    /* Layout 2 cột: sidebar 260px + content flex-grow.
       Mobile < md: stack dọc, sidebar thành horizontal chip list ở trên. */
    page: {
        display: 'flex',
        gap: theme.spacing(3),
        marginTop: theme.spacing(2),
        marginBottom: theme.spacing(4),
        [theme.breakpoints.down('sm')]: {
            flexDirection: 'column',
            gap: theme.spacing(2),
        },
    },
    pageHeader: {
        display: 'flex',
        alignItems: 'baseline',
        justifyContent: 'space-between',
        marginTop: theme.spacing(2),
        marginBottom: theme.spacing(1),
        flexWrap: 'wrap',
        gap: theme.spacing(1),
    },
    pageTitle: {
        fontSize: '1.6rem',
        fontWeight: 700,
        color: theme.palette.text.primary,
        letterSpacing: -0.3,
    },
    pageSubtitle: {
        color: theme.palette.text.secondary,
        fontSize: '0.875rem',
    },

    /* SIDEBAR */
    sidebar: {
        width: 320,
        flexShrink: 0,
        padding: theme.spacing(2),
        borderRadius: 14,
        backgroundColor: theme.palette.background.paper,
        border:
            theme.palette.type === 'dark'
                ? '1px solid rgba(129, 140, 248, 0.18)'
                : '1px solid rgba(0, 0, 0, 0.06)',
        boxShadow:
            theme.palette.type === 'dark'
                ? '0 4px 16px rgba(0,0,0,0.45)'
                : '0 2px 10px rgba(17, 24, 39, 0.06)',
        height: 'fit-content',
        position: 'sticky',
        top: theme.spacing(2),
        /* Cancel hover shadow global (index.css). Settings paper KHÔNG nên
           lift khi hover — đây là chrome, không phải card. */
        '&:hover': {
            boxShadow:
                theme.palette.type === 'dark'
                    ? '0 4px 16px rgba(0,0,0,0.45)'
                    : '0 2px 10px rgba(17, 24, 39, 0.06)',
        },
        [theme.breakpoints.down('sm')]: {
            width: '100%',
            position: 'static',
            padding: theme.spacing(1),
        },
    },
    /* Mobile: list ngang scroll được; desktop: list dọc. Gói trong cùng 1 div,
       đổi flex-direction theo breakpoint. */
    sidebarList: {
        display: 'flex',
        flexDirection: 'column',
        gap: 6,
        [theme.breakpoints.down('sm')]: {
            flexDirection: 'row',
            overflowX: 'auto',
            gap: theme.spacing(1),
            paddingBottom: theme.spacing(0.5),
            /* Scrollbar nhẹ trên mobile */
            scrollbarWidth: 'thin',
        },
    },
    /* 1 item trong sidebar: icon + label + (badge). Hover nền nhẹ, active đậm hơn.
       Padding rộng + icon-box to để item "thoáng", không bị nén — settings page
       không phải mật độ cao như feed. */
    sidebarItem: {
        display: 'flex',
        alignItems: 'center',
        gap: theme.spacing(1.5),
        padding: theme.spacing(1.5, 1.75),
        borderRadius: 12,
        cursor: 'pointer',
        textDecoration: 'none',
        color: theme.palette.text.primary,
        transition: 'background-color 0.15s ease, color 0.15s ease',
        '&:hover': {
            backgroundColor:
                theme.palette.type === 'dark'
                    ? 'rgba(129, 140, 248, 0.10)'
                    : 'rgba(57, 73, 171, 0.06)',
            textDecoration: 'none',
        },
        [theme.breakpoints.down('sm')]: {
            flexShrink: 0,
            padding: theme.spacing(1, 1.5),
        },
    },
    sidebarItemActive: {
        backgroundColor:
            theme.palette.type === 'dark'
                ? 'rgba(129, 140, 248, 0.18)'
                : 'rgba(57, 73, 171, 0.12)',
        color: theme.palette.primary.main,
        fontWeight: 600,
        '&:hover': {
            backgroundColor:
                theme.palette.type === 'dark'
                    ? 'rgba(129, 140, 248, 0.22)'
                    : 'rgba(57, 73, 171, 0.16)',
        },
    },
    sidebarIconBox: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 38,
        height: 38,
        borderRadius: 10,
        flexShrink: 0,
        backgroundColor:
            theme.palette.type === 'dark'
                ? 'rgba(129, 140, 248, 0.12)'
                : 'rgba(57, 73, 171, 0.08)',
        color: theme.palette.primary.main,
    },
    sidebarIconBoxActive: {
        backgroundColor:
            theme.palette.type === 'dark'
                ? 'rgba(129, 140, 248, 0.28)'
                : 'rgba(57, 73, 171, 0.18)',
    },
    sidebarLabel: {
        fontSize: '0.9375rem',
        fontWeight: 500,
        flex: 1,
        whiteSpace: 'nowrap',
    },
    /* Badge "Sắp ra mắt" — nhỏ, dùng cho item chưa active.
       Mobile ẩn để tiết kiệm chỗ. */
    sidebarBadge: {
        fontSize: '0.65rem',
        fontWeight: 600,
        padding: '2px 6px',
        borderRadius: 6,
        backgroundColor:
            theme.palette.type === 'dark'
                ? 'rgba(251, 191, 36, 0.18)'
                : 'rgba(245, 158, 11, 0.12)',
        color: theme.palette.type === 'dark' ? '#fbbf24' : '#b45309',
        flexShrink: 0,
        [theme.breakpoints.down('sm')]: {
            display: 'none',
        },
    },

    /* CONTENT (right column) */
    content: {
        flex: 1,
        minWidth: 0,
    },
    contentPaper: {
        padding: theme.spacing(3),
        borderRadius: 14,
        backgroundColor: theme.palette.background.paper,
        border:
            theme.palette.type === 'dark'
                ? '1px solid rgba(129, 140, 248, 0.18)'
                : '1px solid rgba(0, 0, 0, 0.06)',
        boxShadow:
            theme.palette.type === 'dark'
                ? '0 4px 16px rgba(0,0,0,0.45)'
                : '0 2px 10px rgba(17, 24, 39, 0.06)',
        '&:hover': {
            boxShadow:
                theme.palette.type === 'dark'
                    ? '0 4px 16px rgba(0,0,0,0.45)'
                    : '0 2px 10px rgba(17, 24, 39, 0.06)',
        },
        [theme.breakpoints.down('xs')]: {
            padding: theme.spacing(2),
        },
    },
    /* Section header: icon lớn + tiêu đề + mô tả. Hơi long-form so với
       sidebar item (đây là chỗ user đọc, không phải nơi điều hướng). */
    sectionHeader: {
        display: 'flex',
        alignItems: 'flex-start',
        gap: theme.spacing(1.75),
        marginBottom: theme.spacing(2.5),
    },
    sectionIconBox: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 44,
        height: 44,
        borderRadius: 12,
        flexShrink: 0,
        backgroundColor:
            theme.palette.type === 'dark'
                ? 'rgba(129, 140, 248, 0.18)'
                : 'rgba(57, 73, 171, 0.12)',
        color: theme.palette.primary.main,
    },
    sectionTitle: {
        fontSize: '1.25rem',
        fontWeight: 700,
        color: theme.palette.text.primary,
        lineHeight: 1.3,
    },
    sectionDescription: {
        marginTop: 4,
        color: theme.palette.text.secondary,
        fontSize: '0.875rem',
        lineHeight: 1.5,
    },

    /* === Security section === */
    formStack: {
        display: 'flex',
        flexDirection: 'column',
        gap: theme.spacing(1.25),
        maxWidth: 460,
    },
    submitRow: {
        display: 'flex',
        justifyContent: 'flex-start',
        gap: theme.spacing(1),
        marginTop: theme.spacing(0.5),
    },
    banner: {
        display: 'flex',
        gap: theme.spacing(1.25),
        padding: theme.spacing(1.75, 2),
        borderRadius: 12,
        border: `1px solid ${
            theme.palette.type === 'dark'
                ? 'rgba(129, 140, 248, 0.3)'
                : 'rgba(57, 73, 171, 0.18)'
        }`,
        backgroundColor:
            theme.palette.type === 'dark'
                ? 'rgba(129, 140, 248, 0.08)'
                : 'rgba(57, 73, 171, 0.04)',
        maxWidth: 600,
    },
    bannerIcon: {
        color: theme.palette.primary.main,
        flexShrink: 0,
        marginTop: 2,
    },
    bannerText: {
        fontSize: '0.875rem',
        color: theme.palette.text.primary,
        lineHeight: 1.55,
    },

    /* === Appearance section === */
    optionRow: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: theme.spacing(1.5, 0),
        gap: theme.spacing(2),
        '&:not(:last-child)': {
            borderBottom:
                theme.palette.type === 'dark'
                    ? '1px solid rgba(255,255,255,0.06)'
                    : '1px solid rgba(0,0,0,0.06)',
        },
    },
    optionLabel: {
        fontSize: '0.9375rem',
        fontWeight: 600,
        color: theme.palette.text.primary,
    },
    optionHint: {
        fontSize: '0.8125rem',
        color: theme.palette.text.secondary,
        marginTop: 2,
        lineHeight: 1.45,
    },

    /* === Coming soon section === */
    comingSoonPill: {
        display: 'inline-block',
        marginLeft: theme.spacing(1),
        fontSize: '0.65rem',
        fontWeight: 700,
        padding: '3px 8px',
        borderRadius: 6,
        verticalAlign: 'middle',
        backgroundColor:
            theme.palette.type === 'dark'
                ? 'rgba(251, 191, 36, 0.18)'
                : 'rgba(245, 158, 11, 0.12)',
        color: theme.palette.type === 'dark' ? '#fbbf24' : '#b45309',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    suggestionList: {
        margin: 0,
        paddingLeft: theme.spacing(2.5),
        '& li': {
            marginBottom: theme.spacing(0.75),
            color: theme.palette.text.primary,
            fontSize: '0.9rem',
            lineHeight: 1.55,
        },
        '& li::marker': {
            color: theme.palette.primary.main,
        },
        '& strong': {
            color: theme.palette.text.primary,
        },
        '& em': {
            color: theme.palette.text.secondary,
            fontStyle: 'normal',
            fontSize: '0.8125rem',
        },
    },
    suggestionIntro: {
        color: theme.palette.text.secondary,
        marginBottom: theme.spacing(1.5),
        fontSize: '0.9rem',
        lineHeight: 1.55,
    },
}));
