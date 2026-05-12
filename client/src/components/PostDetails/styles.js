import { makeStyles } from '@material-ui/core/styles';

export default makeStyles((theme) => ({
  rootPaper: {
    padding: theme.spacing(2.5),
    borderRadius: 15,
    maxWidth: '100%',
    boxSizing: 'border-box',
    overflow: 'hidden',
  },
  media: {
    display: 'block',
    width: 'auto',
    height: 'auto',
    maxWidth: '100%',
    objectFit: 'contain',
    imageRendering: 'auto',
    borderRadius: 12,
    boxSizing: 'border-box',
  },
  mediaFrame: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    width: '100%',
    maxWidth: 480,
    [theme.breakpoints.down('sm')]: {
      maxWidth: '100%',
    },
  },
  card: {
    display: 'flex',
    width: '100%',
    alignItems: 'flex-start',
    gap: theme.spacing(3),
    boxSizing: 'border-box',
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column',
      alignItems: 'stretch',
      gap: theme.spacing(2),
    },
  },
  section: {
    borderRadius: 20,
    flex: '1 1 0',
    minWidth: 0,
    display: 'flex',
    flexDirection: 'column',
    margin: theme.spacing(0, 0, 1, 0),
    '& h1': {
      wordBreak: 'break-word',
    },
    '& p': {
      wordBreak: 'break-word',
    },
  },
  articleContent: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
    gap: theme.spacing(0.5),
  },
  postTitle: {
    margin: 0,
    fontWeight: 700,
    fontSize: '1.65rem',
    lineHeight: 1.28,
    letterSpacing: '-0.025em',
    color: theme.palette.text.primary,
    [theme.breakpoints.up('md')]: {
      fontSize: '1.9rem',
      lineHeight: 1.22,
    },
  },
  tagRow: {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: theme.spacing(0.75),
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(0.25),
  },
  tagChip: {
    height: 28,
    fontSize: '0.75rem',
    fontWeight: 600,
    letterSpacing: '0.02em',
    border: '1px solid',
    borderColor:
      theme.palette.type === 'dark'
        ? 'rgba(165, 180, 252, 0.4)'
        : 'rgba(57, 73, 171, 0.28)',
    backgroundColor:
      theme.palette.type === 'dark'
        ? 'rgba(129, 140, 248, 0.12)'
        : 'rgba(57, 73, 171, 0.07)',
    color: theme.palette.type === 'dark' ? '#e0e7ff' : theme.palette.primary.dark,
    '& .MuiChip-label': {
      paddingLeft: 10,
      paddingRight: 10,
    },
  },
  postBody: {
    margin: 0,
    marginTop: theme.spacing(1.5),
    fontSize: '1.0625rem',
    lineHeight: 1.8,
    color: theme.palette.text.primary,
    whiteSpace: 'pre-wrap',
  },
  postMeta: {
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: theme.spacing(1),
    marginTop: theme.spacing(2.5),
    paddingTop: theme.spacing(2),
    borderTop: `1px solid ${theme.palette.divider}`,
  },
  postAuthor: {
    fontWeight: 600,
    color: theme.palette.text.secondary,
  },
  metaDot: {
    width: 5,
    height: 5,
    borderRadius: '50%',
    backgroundColor: theme.palette.text.disabled,
    flexShrink: 0,
  },
  sectionDivider: {
    margin: theme.spacing(3, 0),
  },
  imageSection: {
    flex: '0 1 42%',
    maxWidth: 480,
    minWidth: 220,
    display: 'flex',
    flexDirection: 'column',
    alignSelf: 'flex-start',
    [theme.breakpoints.down('sm')]: {
      flex: '0 1 auto',
      width: '100%',
      maxWidth: '100%',
      minWidth: 0,
    },
  },
  recommendedPosts: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: theme.spacing(2),
    marginTop: theme.spacing(1),
  },
  recommendedCard: {
    flex: '1 1 200px',
    maxWidth: 280,
    minWidth: 180,
    padding: theme.spacing(1.5),
    boxSizing: 'border-box',
    borderRadius: 16,
    border: `1px solid ${theme.palette.divider}`,
    cursor: 'pointer',
    transition: 'box-shadow 0.22s ease, transform 0.22s ease, border-color 0.22s ease',
    '&:hover': {
      boxShadow:
        theme.palette.type === 'dark'
          ? '0 6px 18px rgba(0,0,0,0.35)'
          : '0 6px 18px rgba(15,23,42,0.1)',
      transform: 'translateY(-1px)',
      borderColor:
        theme.palette.type === 'dark'
          ? 'rgba(165, 180, 252, 0.35)'
          : 'rgba(57, 73, 171, 0.22)',
    },
  },
  recommendedMedia: {
    display: 'block',
    width: '100%',
    maxHeight: 160,
    objectFit: 'contain',
    objectPosition: 'center',
    borderRadius: 12,
    backgroundColor:
      theme.palette.type === 'dark' ? 'rgba(255,255,255,0.06)' : '#f5f5f5',
    marginTop: theme.spacing(1),
  },
  recommendedMessage: {
    display: '-webkit-box',
    WebkitLineClamp: 3,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
  },
  loadingPaper: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '20px',
    borderRadius: '15px',
    height: '39vh',
  },
  commentsSection: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
  },
  commentsPanel: {
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: theme.shape.borderRadius,
    overflow: 'hidden',
    backgroundColor:
      theme.palette.type === 'dark' ? 'rgba(255,255,255,0.03)' : theme.palette.background.paper,
    boxShadow:
      theme.palette.type === 'dark'
        ? 'none'
        : '0 1px 3px rgba(15, 23, 42, 0.06)',
  },
  commentsPanelHeader: {
    padding: theme.spacing(1.5, 2),
    borderBottom: `1px solid ${theme.palette.divider}`,
    backgroundColor:
      theme.palette.type === 'dark' ? 'rgba(255,255,255,0.04)' : 'rgba(57, 73, 171, 0.04)',
  },
  commentsListHeading: {
    fontWeight: 700,
    letterSpacing: '0.02em',
    fontSize: '0.9375rem',
    textTransform: 'uppercase',
    color: theme.palette.text.secondary,
  },
  commentsListBody: {
    padding: theme.spacing(0, 2),
    maxWidth: '100%',
    boxSizing: 'border-box',
  },
  commentsScroll: {
    maxHeight: 220,
    overflowY: 'auto',
    padding: theme.spacing(1.5, 0),
    paddingRight: theme.spacing(0.5),
    border: 'none',
    backgroundColor: 'transparent',
    '&::-webkit-scrollbar': {
      width: 6,
    },
    '&::-webkit-scrollbar-thumb': {
      backgroundColor: theme.palette.divider,
      borderRadius: 3,
    },
  },
  commentsEmpty: {
    padding: theme.spacing(2, 0),
    textAlign: 'center',
    fontStyle: 'italic',
  },
  commentItem: {
    padding: theme.spacing(1.25, 0),
    borderBottom: `1px solid ${theme.palette.divider}`,
    fontSize: '0.875rem',
    lineHeight: 1.55,
    '&:last-of-type': {
      borderBottom: 'none',
    },
    '& strong': {
      color: theme.palette.primary.main,
      fontWeight: 600,
    },
  },
  writeCommentBlock: {
    width: '100%',
    padding: theme.spacing(2),
    borderTop: `1px solid ${theme.palette.divider}`,
    backgroundColor:
      theme.palette.type === 'dark' ? 'rgba(0,0,0,0.12)' : 'rgba(57, 73, 171, 0.04)',
    boxSizing: 'border-box',
  },
  writeCommentHeading: {
    marginBottom: theme.spacing(1.25),
    fontWeight: 700,
    fontSize: '1rem',
    color: theme.palette.text.primary,
  },
  commentComposerStack: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    alignItems: 'stretch',
  },
  commentPostRow: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginTop: theme.spacing(1),
  },
  commentField: {
    width: '100%',
    marginTop: 0,
    '& .MuiOutlinedInput-root': {
      fontSize: '0.875rem',
      backgroundColor:
        theme.palette.type === 'dark' ? 'rgba(255,255,255,0.06)' : '#fff',
    },
    '& .MuiOutlinedInput-input': {
      padding: theme.spacing(1, 1.25),
    },
    '& .MuiOutlinedInput-inputMultiline': {
      padding: theme.spacing(1.125, 1.25),
    },
    '& .MuiInputLabel-outlined': {
      fontSize: '0.875rem',
    },
  },
  commentPostButton: {
    textTransform: 'none',
    fontWeight: 600,
    padding: theme.spacing(0.5, 2),
    minHeight: 34,
    whiteSpace: 'nowrap',
  },
}));
