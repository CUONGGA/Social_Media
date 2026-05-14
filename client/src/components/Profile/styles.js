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
        /* Phẳng: bg trắng (paper), bo góc, KHÔNG shadow/border/hover. */
        padding: theme.spacing(3),
        borderRadius: 16,
        backgroundColor: theme.palette.background.paper,
        boxShadow: 'none',
        border: 'none',
        '&:hover': {
            boxShadow: 'none',
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
        /* Cùng style như header: bg trắng, bo góc, phẳng. */
        padding: theme.spacing(3),
        borderRadius: 16,
        backgroundColor: theme.palette.background.paper,
        boxShadow: 'none',
        border: 'none',
        '&:hover': {
            boxShadow: 'none',
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
