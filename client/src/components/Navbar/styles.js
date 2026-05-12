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
    [theme.breakpoints.down('sm')]: {
      width: '100%',
      justifyContent: 'center',
    },
  },
  profile: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1.5),
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
    padding: theme.spacing(0.4, 1.5),
    minHeight: 34,
    minWidth: 0,
    borderRadius: 8,
    borderWidth: 1.5,
    borderStyle: 'solid',
    borderColor: theme.palette.primary.main,
    color: theme.palette.primary.main,
    backgroundColor: '#fff',
    boxShadow: 'none',
    flexShrink: 0,
    transition: 'background-color 0.2s ease, color 0.2s ease, border-color 0.2s ease',
    '& .MuiButton-startIcon': {
      marginRight: theme.spacing(0.75),
    },
    '&:hover': {
      borderColor: theme.palette.primary.dark,
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.primary.contrastText,
      boxShadow: 'none',
    },
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
  },
  purple: {
    color: theme.palette.getContrastText(deepPurple[500]),
    backgroundColor: deepPurple[500],
  },
  signInButton: {
  textTransform: 'none',                // chữ bình thường
  fontWeight: 600,                      // chữ đậm hơn
  fontSize: '1rem',                     // cỡ chữ vừa phải
  padding: '8px 22px',                  // padding gọn nhưng sang
  borderRadius: '12px',                 // bo tròn mềm mại
  background: 'linear-gradient(90deg, #141620 0%, #6573c3 100%)', // gradient nhẹ
  color: '#fff',
  boxShadow: '0 4px 12px rgba(63,81,181,0.3)', // shadow sang
  transition: 'all 0.3s ease',
  cursor: 'pointer',
  '&:hover': {
    background: 'linear-gradient(90deg, #6573c3 0%, #3f51b5 100%)', // đổi gradient khi hover
    boxShadow: '0 6px 16px rgba(63,81,181,0.4)', // shadow nổi bật hơn
    transform: 'translateY(-2px)',  // nâng nhẹ khi hover
  },
  },
}));