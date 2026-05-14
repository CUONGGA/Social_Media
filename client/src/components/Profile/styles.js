import { makeStyles } from '@material-ui/core/styles';
import { deepPurple } from '@material-ui/core/colors';

export default makeStyles((theme) => ({
    wrapper: {
        display: 'flex',
        flexDirection: 'column',
        gap: theme.spacing(3),
        paddingTop: theme.spacing(2),
        paddingBottom: theme.spacing(4),
    },

    headerPaper: {
        /* Phẳng: bg trắng (paper), bo góc, KHÔNG shadow/border/hover.
           Phải dùng `!important` ở hover vì `index.css` có rule global
           `body[data-theme="dark"] .MuiPaper-root:hover` với specificity (0,2,1)
           cao hơn class JSS — nếu không sẽ tự bật shadow khi dark mode. */
        padding: theme.spacing(3),
        borderRadius: 16,
        backgroundColor: theme.palette.background.paper,
        boxShadow: 'none !important',
        border: 'none',
        '&:hover': {
            boxShadow: 'none !important',
            backgroundColor: theme.palette.background.paper,
        },
    },

    headerContent: {
        display: 'flex',
        alignItems: 'center',
        gap: theme.spacing(3),
        flexWrap: 'wrap',
    },

    headerAvatar: {
        width: theme.spacing(12),
        height: theme.spacing(12),
        fontSize: '2.5rem',
    },

    purple: {
        color: theme.palette.getContrastText(deepPurple[500]),
        backgroundColor: deepPurple[500],
    },

    headerInfo: {
        flex: 1,
        minWidth: 200,
        display: 'flex',
        flexDirection: 'column',
        gap: theme.spacing(0.75),
    },

    headerName: {
        fontWeight: 700,
        lineHeight: 1.1,
    },

    headerMeta: {
        display: 'flex',
        alignItems: 'center',
        gap: theme.spacing(1.25),
        flexWrap: 'wrap',
    },

    headerMetaItem: {
        color: theme.palette.text.secondary,
    },

    /* Bio: kiểu "lời tự giới thiệu", tách khỏi metadata bằng accent bar bên
       trái (primary alpha). Font lớn hơn body2 chút (95% body1) để dễ đọc;
       màu text.secondary để KHÔNG tranh sự chú ý với tên hiển thị.
       - whitespace: pre-line  → giữ xuống dòng user gõ trong textarea.
       - word-break: break-word → URL/tag dài không phá layout. */
    headerBio: {
        marginTop: theme.spacing(1.75),
        paddingLeft: theme.spacing(1.5),
        borderLeft: `3px solid ${
            theme.palette.type === 'dark'
                ? 'rgba(129, 140, 248, 0.55)' /* primary indigo sáng cho dark */
                : 'rgba(57, 73, 171, 0.4)'    /* primary indigo đậm cho light */
        }`,
        color: theme.palette.text.secondary,
        whiteSpace: 'pre-line',
        wordBreak: 'break-word',
        maxWidth: 640,
        lineHeight: 1.55,
        fontSize: '0.95rem',
        letterSpacing: 0.1,
        fontStyle: 'italic',
    },

    metaDot: {
        width: 4,
        height: 4,
        borderRadius: '50%',
        backgroundColor: theme.palette.text.disabled,
    },

    editBtn: {
        textTransform: 'none',
        borderRadius: 10,
        fontWeight: 600,
        alignSelf: 'flex-start',
    },

    postsPaper: {
        /* Cùng style như header: bg trắng, bo góc, phẳng.
           `!important` trên hover để né rule global ở `index.css` (xem ghi chú headerPaper). */
        padding: theme.spacing(3),
        borderRadius: 16,
        backgroundColor: theme.palette.background.paper,
        boxShadow: 'none !important',
        border: 'none',
        '&:hover': {
            boxShadow: 'none !important',
            backgroundColor: theme.palette.background.paper,
        },
    },

    sectionTitle: {
        fontWeight: 700,
        marginBottom: theme.spacing(1),
    },

    sectionDivider: {
        marginBottom: theme.spacing(2),
    },

    postsGrid: {
        marginTop: theme.spacing(0.5),
    },

    paginationWrap: {
        display: 'flex',
        justifyContent: 'center',
        marginTop: theme.spacing(3),
    },

    emptyText: {
        padding: theme.spacing(2, 0),
    },

    emptyState: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        gap: theme.spacing(1.5),
        padding: theme.spacing(1, 0),
    },

    emptyCta: {
        textTransform: 'none',
        borderRadius: 10,
        fontWeight: 600,
    },

    loadingPaper: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: theme.spacing(8),
        borderRadius: 16,
    },

    rootPaper: {
        padding: theme.spacing(4),
        borderRadius: 16,
        textAlign: 'center',
    },

    backBtn: {
        marginTop: theme.spacing(2),
        textTransform: 'none',
    },
}));
