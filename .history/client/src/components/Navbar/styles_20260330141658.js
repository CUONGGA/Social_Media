import { makeStyles } from '@material-ui/core/styles';
import { deepPurple } from '@material-ui/core/colors';

export default makeStyles((theme) => ({
  appBar: {
    borderRadius: 15,
    margin: '30px 0',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 50px',
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column',
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
    width: '400px',
    [theme.breakpoints.down('sm')]: {
      width: 'auto',
    },
  },
  profile: {
    display: 'flex',
    justifyContent: 'space-between',
    width: '400px',
    alignItems: 'center',
    [theme.breakpoints.down('sm')]: {
      width: 'auto',
      marginTop: 20,
      justifyContent: 'center',
    },
  },
  logout: {
    marginLeft: '20px',
  },
  userName: {
    display: 'flex',
    alignItems: 'center',
    textAlign: 'center',
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