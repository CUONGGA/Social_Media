import { makeStyles } from '@material-ui/core/styles';
import { deepPurple } from '@material-ui/core/colors';

export default makeStyles((theme) => ({
  appBar: {
    borderRadius: 12,
    margin: theme.spacing(1.25, 0),
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing(1, 2.5),
    boxShadow:
      theme.palette.type === 'dark'
        ? '0 1px 4px rgba(0,0,0,0.35)'
        : '0 1px 3px rgba(0,0,0,0.08)',
    transition: 'none',
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column',
      padding: theme.spacing(1.5, 2),
    },
  },
  heading: {
    color: theme.palette.primary.main,
    textDecoration: 'none',
    fontSize: '2em',
    fontWeight: 300,
  },
  image: {
    marginLeft: '10px',
    marginTop: '5px',
  },
  toolbar: {
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    flex: 1,
    minWidth: 0,
    paddingRight: 0,
    gap: theme.spacing(2.5),
    [theme.breakpoints.down('sm')]: {
      width: '100%',
      justifyContent: 'center',
      flexWrap: 'wrap',
      gap: theme.spacing(1.5),
    },
  },
  profile: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(2),
    flexWrap: 'nowrap',
    minWidth: 0,
    maxWidth: '100%',
    [theme.breakpoints.down('sm')]: {
      marginTop: theme.spacing(1),
      flexWrap: 'wrap',
      justifyContent: 'center',
    },
  },
  logout: {
    textTransform: 'none',
    fontWeight: 600,
    fontSize: '0.8125rem',
    padding: '8px 16px',
    minHeight: 36,
    borderRadius: 10,
    lineHeight: 1.2,
    color: '#5c5c5c',
    border: '1px solid #e0e0e0',
    backgroundColor: '#fff',
    boxShadow: 'none',
    flexShrink: 0,
    transition: 'background-color 0.2s ease, border-color 0.2s ease, color 0.2s ease',
    '& .MuiButton-startIcon': {
      marginRight: 6,
    },
    '&:hover': {
      backgroundColor: '#e8eaf6',
      border: '1px solid #7986cb',
      color: '#283593',
      boxShadow: 'none',
    },
    '&.MuiButton-outlined': {
      border: '1px solid #e0e0e0',
      padding: '8px 16px',
      '&:hover': {
        border: '1px solid #7986cb',
        backgroundColor: '#e8eaf6',
      },
    },
  },
  logoutIcon: {
    fontSize: 18,
  },
  userName: {
    display: 'block',
    fontWeight: 600,
    fontSize: '0.9375rem',
    lineHeight: 1.2,
    maxWidth: 160,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    minWidth: 0,
  },
  brandContainer: {
    display: 'flex',
    alignItems: 'center',
    textDecoration: 'none',
    color: 'inherit',
    '&:hover': {
      textDecoration: 'none',
      opacity: 1,
    },
  },
  purple: {
    color: theme.palette.getContrastText(deepPurple[500]),
    backgroundColor: deepPurple[500],
  },
  themeToggle: {
    padding: 10,
    borderRadius: 12,
    border:
      theme.palette.type === 'dark'
        ? '1px solid rgba(129, 140, 248, 0.35)'
        : '1px solid rgba(57, 73, 171, 0.22)',
    background:
      theme.palette.type === 'dark'
        ? 'linear-gradient(145deg, rgba(99,102,241,0.22) 0%, rgba(30,27,75,0.55) 100%)'
        : 'linear-gradient(145deg, #f5f7ff 0%, #e8eaf6 100%)',
    color: theme.palette.type === 'dark' ? '#e0e7ff' : '#3949ab',
    boxShadow:
      theme.palette.type === 'dark'
        ? '0 2px 12px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.06)'
        : '0 2px 8px rgba(57, 73, 171, 0.15)',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease',
    '&:hover': {
      background:
        theme.palette.type === 'dark'
          ? 'linear-gradient(145deg, rgba(129,140,248,0.32) 0%, rgba(49,46,129,0.65) 100%)'
          : 'linear-gradient(145deg, #fff 0%, #e8eaf6 100%)',
      boxShadow:
        theme.palette.type === 'dark'
          ? '0 4px 18px rgba(99,102,241,0.25)'
          : '0 4px 14px rgba(57, 73, 171, 0.22)',
      transform: 'scale(1.06)',
    },
    '& svg': {
      fontSize: 22,
      filter:
        theme.palette.type === 'dark'
          ? 'drop-shadow(0 0 6px rgba(165, 180, 252, 0.45))'
          : 'drop-shadow(0 1px 2px rgba(57, 73, 171, 0.25))',
    },
  },
  signInButton: {
    textTransform: 'none',
    fontWeight: 600,
    fontSize: '0.875rem',
    letterSpacing: '0.02em',
    padding: '10px 22px',
    minHeight: 40,
    borderRadius: 10,
    lineHeight: 1.2,
    boxShadow: 'none',
    backgroundColor: '#3f51b5',
    color: '#fff',
    transition: 'background-color 0.2s ease, box-shadow 0.2s ease',
    '&:hover': {
      backgroundColor: '#283593',
      color: '#fff',
      boxShadow: '0 2px 6px rgba(40, 53, 147, 0.4)',
    },
    '&.MuiButton-containedPrimary': {
      boxShadow: 'none',
      backgroundColor: '#3f51b5',
      '&:hover': {
        backgroundColor: '#283593',
        boxShadow: '0 2px 6px rgba(40, 53, 147, 0.4)',
      },
    },
  },
}));