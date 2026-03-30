import { makeStyles } from '@material-ui/core/styles';
import { deepPurple } from '@material-ui/core/colors';

export default makeStyles((theme) => ({
  appBar: {
    borderRadius: 15,
    margin: '20px 0',
    padding: '12px 60px',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fafafa',              // nền sáng, mềm mại
    boxShadow: '0 6px 20px rgba(0,0,0,0.06)', // shadow nhẹ sang trọng
    border: '1px solid #e0e0e0',             // viền mềm mại
    transition: 'all 0.3s ease',
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column',
      padding: '12px 20px',
    },
  },
  heading: {
    color: '#222',
    textDecoration: 'none',
    fontSize: '2rem',
    fontWeight: 600,
    fontFamily: 'Inter, sans-serif',
    letterSpacing: '0.5px',
  },
  image: {
    marginLeft: '12px',
    marginTop: '3px',
    height: '55px',
    borderRadius: '6px',
    transition: 'transform 0.25s ease',
    '&:hover': {
      transform: 'scale(1.08)',
    },
  },
  toolbar: {
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    width: '400px',
    gap: '14px',
    [theme.breakpoints.down('sm')]: {
      width: '100%',
      justifyContent: 'center',
      marginTop: '12px',
      flexWrap: 'wrap',
    },
  },
  profile: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    width: '400px',
    [theme.breakpoints.down('sm')]: {
      width: '100%',
      justifyContent: 'center',
      marginTop: '15px',
      flexWrap: 'wrap',
    },
  },
  logout: {
    textTransform: 'none',
    fontWeight: 600,
    fontSize: '0.95rem',
    padding: '7px 20px',
    borderRadius: '10px',
    background: 'linear-gradient(90deg, #f50057 0%, #ff4081 100%)',
    color: '#fff',
    boxShadow: '0 4px 12px rgba(245,0,87,0.3)',
    transition: 'all 0.3s ease',
    cursor: 'pointer',
    '&:hover': {
      boxShadow: '0 6px 16px rgba(245,0,87,0.4)',
      transform: 'translateY(-2px)',
    },
  },
  userName: {
    fontWeight: 600,
    color: '#333',
    fontSize: '1rem',
  },
  brandContainer: {
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
  purple: {
    color: '#fff',
    backgroundColor: deepPurple[500],
    width: '45px',
    height: '45px',
    fontSize: '1.1rem',
  },
  signInButton: {
    textTransform: 'none',
    fontWeight: 600,
    fontSize: '1rem',
    padding: '8px 22px',
    borderRadius: '12px',
    background: 'linear-gradient(90deg, #3f51b5 0%, #6573c3 100%)',
    color: '#fff',
    boxShadow: '0 4px 12px rgba(63,81,181,0.3)',
    transition: 'all 0.3s ease',
    cursor: 'pointer',
    '&:hover': {
      background: 'linear-gradient(90deg, #6573c3 0%, #3f51b5 100%)',
      boxShadow: '0 6px 16px rgba(63,81,181,0.4)',
      transform: 'translateY(-2px)',
    },
  },
}));