import { makeStyles } from '@material-ui/core/styles';
import { deepPurple } from '@material-ui/core/colors';

export default makeStyles((theme) => ({
  appBar: {
    borderRadius: 0,
    margin: 0,
    padding: '8px 40px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    boxShadow: 'none',
    borderBottom: '1px solid #e0e0e0',
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column',
      padding: '10px 20px',
    },
  },
  heading: {
    color: '#222',
    textDecoration: 'none',
    fontSize: '1.6rem',
    fontWeight: 500,
    fontFamily: 'Roboto, sans-serif',
  },
  image: {
    marginLeft: '8px',
    height: '50px',
    transition: 'transform 0.2s',
    '&:hover': {
      transform: 'scale(1.05)',
    },
  },
  toolbar: {
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    width: 'auto',
    gap: '12px',
    [theme.breakpoints.down('sm')]: {
      width: '100%',
      justifyContent: 'center',
      marginTop: '10px',
    },
  },
  profile: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    [theme.breakpoints.down('sm')]: {
      flexWrap: 'wrap',
      justifyContent: 'center',
      marginTop: '10px',
    },
  },
  logout: {
    textTransform: 'none',
    fontWeight: 500,
    fontSize: '0.9rem',
    padding: '6px 14px',
    borderRadius: '6px',
    backgroundColor: '#f5f5f5',
    color: '#333',
    transition: 'all 0.2s',
    '&:hover': {
      backgroundColor: '#e0e0e0',
    },
  },
  userName: {
    fontWeight: 500,
    color: '#333',
    fontSize: '0.95rem',
  },
  brandContainer: {
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
  },
  purple: {
    backgroundColor: deepPurple[500],
    color: '#fff',
    width: '40px',
    height: '40px',
    fontSize: '1rem',
  },
}));